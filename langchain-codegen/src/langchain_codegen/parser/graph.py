from pydantic import BaseModel
from pathlib import Path
from xml.etree import ElementTree as ET
from typing import Optional


class LeafNode(BaseModel):
    content: str
    next: Optional["LeafNode"] = None
    block: Optional["Block"] = None


class Text(LeafNode):
    @classmethod
    def from_xml(cls, elem: ET.Element) -> "Text":
        return cls(content=extract_text_content(elem))


class Code(LeafNode):
    language: str = ""
    caption: str | None = None

    @classmethod
    def from_xml(cls, elem: ET.Element) -> "Code":
        if elem.tag == "TabsNode":
            combined_content = ""
            
            for tab_node in elem.findall("TabNode"):
                tab_name = tab_node.get("tabname", "")
                
                container = tab_node.find("container")
                if container is not None:
                    caption = ""
                    caption_elem = container.find("caption")
                    if caption_elem is not None:
                        caption = extract_text_content(caption_elem)
                    
                    literal_block = container.find("literal_block")
                    if literal_block is not None:
                        language = literal_block.get("language", "")
                        content = literal_block.text or ""
                        
                        tab_title = tab_name or caption
                        combined_content += f"### {tab_title}\n\n"
                        combined_content += f"```{language}\n{content}\n```\n\n"
            
            return cls(content=combined_content.strip(), language="markdown")
            
        elif elem.tag.endswith("container") and "literal-block-wrapper" in (
            elem.get("classes") or ""
        ):
            # For code blocks with captions
            caption = ""
            code_content = ""
            code_language = ""

            for child in elem:
                tag = child.tag
                if "}" in tag:
                    tag = tag.split("}", 1)[1]

                if tag == "caption":
                    caption = extract_text_content(child)
                elif tag == "literal_block":
                    code_content = child.text or ""
                    code_language = child.get("language", "")

            return cls(
                content=code_content,
                language=code_language,
                caption=caption if caption else None,
            )
        else:
            # Regular code block
            return cls(content=elem.text or "", language=elem.get("language", ""))


class Table(LeafNode):
    @classmethod
    def from_xml(cls, elem: ET.Element) -> "Table":
        markdown_table = []

        tgroup = elem.find("tgroup")
        if tgroup is None:
            return cls(content="[Empty Table]")

        headers = []
        thead = tgroup.find("thead")
        if thead is not None:
            for row in thead.findall("row"):
                header_row = []
                for entry in row.findall("entry"):
                    header_text = extract_text_content(entry).strip()
                    header_row.append(header_text)
                headers = header_row

        if headers:
            markdown_table.append("| " + " | ".join(headers) + " |")
            markdown_table.append("| " + " | ".join(["---"] * len(headers)) + " |")

        tbody = tgroup.find("tbody")
        if tbody is not None:
            for row in tbody.findall("row"):
                row_cells = []
                for entry in row.findall("entry"):
                    cell_text = extract_text_content(entry).strip().replace("\n", " ")
                    row_cells.append(cell_text)
                markdown_table.append("| " + " | ".join(row_cells) + " |")

        if not headers and len(markdown_table) > 0:
            first_row = markdown_table[0]
            separator_count = first_row.count("|") - 1
            markdown_table.insert(
                0, "| " + " | ".join(["---"] * separator_count) + " |"
            )

        table_content = "\n".join(markdown_table)
        return cls(content=table_content)


class Block(BaseModel):
    title: str = ""
    nodes: list[Text | Code | Table] = []
    first_node: Text | Code | Table | None = None
    next: Optional["Block"] = None

    @classmethod
    def from_xml(cls, children: list[ET.Element]) -> "Block":
        block = cls()
        nodes = []

        for child in children:
            if child.tag == "paragraph":
                nodes.append(Text.from_xml(child))
            elif child.tag == "literal_block":
                nodes.append(Code.from_xml(child))
            elif child.tag == "container" and "literal-block-wrapper" in (
                child.get("classes") or ""
            ):
                nodes.append(Code.from_xml(child))
            elif child.tag == "table":
                nodes.append(Table.from_xml(child))
            elif child.tag == "note":
                nodes.append(Text.from_xml(child))
            elif child.tag == "TabsNode":
                nodes.append(Code.from_xml(child))
            elif child.tag == "desc":
                metadata = f"Type: {child.get('desctype', '')}\n"
                metadata += f"Domain: {child.get('domain', '')}\n"
                metadata += f"Summary: {child.get('summary', '')}\n"

                for sig in child.findall("desc_signature"):
                    metadata += f"Signature: {extract_text_content(sig)}\n"

                nodes.append(Text(content=metadata))

                desc_content = child.find("desc_content")
                if desc_content is not None:
                    for content_child in desc_content:
                        if content_child.tag == "paragraph":
                            nodes.append(Text.from_xml(content_child))
                        elif content_child.tag == "literal_block":
                            nodes.append(Code.from_xml(content_child))
                        elif content_child.tag == "field_list":
                            field_text = "Fields:\n"
                            for field in content_child.findall("field"):
                                field_name = field.find("field_name")
                                if field_name is not None:
                                    field_text += (
                                        f"- {extract_text_content(field_name)}: "
                                    )
                                field_body = field.find("field_body")
                                if field_body is not None:
                                    field_text += (
                                        f"{extract_text_content(field_body)}\n"
                                    )
                            nodes.append(Text(content=field_text))

        for i in range(len(nodes) - 1):
            nodes[i].next = nodes[i + 1]
            nodes[i].block = block

        block = cls(nodes=nodes)
        if nodes:
            block.first_node = nodes[0]

        return block


class Document(BaseModel):
    title: str = ""
    blocks: list[Block] = []
    first_block: Block | None = None
    source_path: str = ""

    @classmethod
    def from_xml(cls, file_path: Path) -> "Document":
        tree = ET.parse(file_path)
        root = tree.getroot()

        root_section = root.find("section")
        if root_section is None:
            root_section = root.find("table")
            if root_section is not None:
                print(f"Skipping: table at the root: {file_path.as_posix()}")
                return cls()

        assert root_section is not None, "Top-level element must be a section tag"

        document = cls(
            title=root_section.find("title").text,
            source_path=str(file_path),
        )

        block_children = []

        def is_explicit_section(elem: ET.Element) -> bool:
            return (
                elem.tag == "container" and elem.get("split-section") == "True"
            ) or elem.tag == "section"

        for child in root_section:
            if child.tag == "title":
                pass

            elif is_explicit_section(child):
                # group together all the stray elements, then process the group as a block
                if block_children:
                    document.blocks.append(Block.from_xml(block_children))
                    block_children = []

                block = Block.from_xml(list(child))
                block.title = child.find("title").text if child.tag == "section" else ""
                document.blocks.append(block)

            elif child.tag in ["desc", "table"]:
                if block_children:
                    document.blocks.append(Block.from_xml(block_children))
                    block_children = []

                document.blocks.append(Block.from_xml([child]))

            else:
                block_children.append(child)

        if block_children:
            document.blocks.append(Block.from_xml(block_children))

        if document.blocks:
            for i in range(len(document.blocks) - 1):
                document.blocks[i].next = document.blocks[i + 1]

        document.first_block = document.blocks[0]

        return document


def extract_text_content(elem: ET.Element) -> str:
    """Extract all text content from an element, including text from child elements"""
    text = elem.text or ""

    for child in elem:
        # Get child text
        child_text = extract_text_content(child)
        text += child_text

        # Add tail text if any
        if child.tail:
            text += child.tail

    if elem.tag in ["paragraph", "list_item", "note"]:
        text = text.strip()
        text = " ".join([line.strip() for line in text.split("\n")])
    elif elem.tag in ["field_body", "bullet_list"]:
        text = text.strip()
        text = "\n".join([line.strip() for line in text.split("\n")])

    return text


def print_document_structure(document: Document, verbose=False):
    """Print the document structure in a hierarchical format"""
    print(f"[document] {document.title}")

    for i, block in enumerate(document.blocks):
        print(f"  [block] {block.title}")

        for j, node in enumerate(block.nodes):
            if isinstance(node, Text):
                text_preview = (
                    node.content[:100] + "..."
                    if len(node.content) > 100
                    else node.content
                )
                text_preview = text_preview.replace("\n", " ").strip()
                if verbose:
                    print(f'    [text] "{text_preview}"')
                else:
                    print(f"    [text]")
            elif isinstance(node, Code):
                if verbose:
                    print(f"    [code] language: {node.language}")
                    if node.caption:
                        print(f"      caption: {node.caption}")
                else:
                    print(f"    [code]")
            elif isinstance(node, Table):
                print(f"    [table]")


def document_to_markdown(document: Document) -> str:
    """Convert a Document object to Markdown format."""
    markdown = f"# {document.title}\n\n"
    
    current_block = document.first_block
    while current_block:
        if current_block.title:
            markdown += f"## {current_block.title}\n\n"
        
        current_node = current_block.first_node
        while current_node:
            if isinstance(current_node, Text):
                markdown += f"{current_node.content}\n\n"
            elif isinstance(current_node, Code):
                caption = f"*{current_node.caption}*\n\n" if current_node.caption else ""
                
                # For TabsNode content, which is already formatted as markdown
                if current_node.language == "markdown":
                    markdown += f"{caption}{current_node.content}\n\n"
                else:
                    markdown += f"{caption}```{current_node.language}\n{current_node.content}\n```\n\n"
            elif isinstance(current_node, Table):
                markdown += f"{current_node.content}\n\n"
            
            current_node = current_node.next
        
        current_block = current_block.next
    
    return markdown


def main():
    raw_docs_dir = Path("docs").resolve()
    input_dir = raw_docs_dir / "_build" / "xml"
    output_dir = raw_docs_dir.parent / "md_docs"
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(exist_ok=True, parents=True)
    
    # Process each XML file
    for file_path in input_dir.glob("**/*.xml"):
        print(f"Parsing: {file_path.as_posix()}")
        
        try:
            # Parse the document
            document = Document.from_xml(file_path)
            print(f"Found {len(document.blocks)} blocks in {document.title}")
            
            # Create corresponding output path
            rel_path = file_path.relative_to(input_dir)
            md_rel_path = rel_path.with_suffix('.md')
            output_path = output_dir / md_rel_path
            
            # Ensure output directory exists
            output_path.parent.mkdir(exist_ok=True, parents=True)
            
            # Generate markdown and save
            markdown = document_to_markdown(document)
            output_path.write_text(markdown)
            print(f"Saved Markdown to: {output_path.as_posix()}")
        except ET.ParseError as e:
            print(f"Error parsing {file_path.as_posix()}: {e}")
            continue
        except Exception as e:
            print(f"Error processing {file_path.as_posix()}: {e}")
            continue
    
    print(f"\nMarkdown conversion complete. Files saved to {output_dir.absolute()}")
