import requests
from pydantic import BaseModel
from datetime import datetime
import html


class WebSource(BaseModel):
    url: str | None = None
    title: str | None = None
    text: str | None = None


def extract_comment_thread(
    comment: dict,
    max_depth: int = 3,
    current_depth: int = 0,
    max_children=3,
) -> list[str]:
    """
    Recursively extract comments from a thread up to max_depth.
    Returns a list of formatted comment strings.
    """
    if not comment or current_depth > max_depth:
        return []

    results = []

    if comment["text"]:
        timestamp = datetime.fromisoformat(comment["created_at"].replace("Z", "+00:00"))
        author = comment["author"]
        text = html.unescape(comment["text"])
        formatted_comment = f"[{timestamp.strftime('%Y-%m-%d %H:%M')}] {author}: {text}"
        results.append(("  " * current_depth) + formatted_comment)

    if comment.get("children"):
        for child in comment["children"][:max_children]:
            child_comments = extract_comment_thread(child, max_depth, current_depth + 1)
            results.extend(child_comments)

    return results


def fetch_web_sources(query: str, limit: int = 5) -> list[WebSource]:
    search_url = "http://hn.algolia.com/api/v1/search_by_date"

    response = requests.get(
        search_url,
        params={
            "query": query,
            "tags": "story",
            "hitsPerPage": limit,
            "page": 0,
        },
    )

    response.raise_for_status()
    search_result = response.json()

    web_sources = []
    for hit in search_result.get("hits", []):
        item_url = f"https://hn.algolia.com/api/v1/items/{hit['story_id']}"
        response = requests.get(item_url)
        response.raise_for_status()
        item_result = response.json()

        site_url = f"https://news.ycombinator.com/item?id={hit['story_id']}"
        title = hit["title"]
        comments = extract_comment_thread(item_result)
        text = "\n".join(comments) if len(comments) > 0 else None
        web_sources.append(
            WebSource(url=site_url, title=title, text=text)
        )

    return web_sources


if __name__ == "__main__":
    web_sources = fetch_web_sources("EdgeDB", limit=5)

    for source in web_sources:
        print(source.url)
        print(source.title)
        print(source.text)
