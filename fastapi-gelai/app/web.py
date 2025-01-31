import requests
from bs4 import BeautifulSoup
import time
import re

from googlesearch import search

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}


def extract_text_from_url(url: str) -> str:
    """
    Extract main text content from a webpage.
    """
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove script and style elements
        for element in soup(["script", "style", "header", "footer", "nav"]):
            element.decompose()

        # Get text and clean it up
        text = soup.get_text(separator=" ")
        # Remove extra whitespace
        text = re.sub(r"\s+", " ", text).strip()

        return text

    except Exception as e:
        print(f"Error extracting text from {url}: {e}")
        return ""


def fetch_web_sources(query: str, limit: int = 5) -> list[tuple[str, str]]:
    """
    Perform search and extract text from results.
    Returns list of (url, text_content) tuples.
    """
    results = []
    urls = search(query, num_results=limit)

    for url in urls:
        text = extract_text_from_url(url)
        if text:  # Only include if we got some text
            results.append((url, text))
        # Be nice to servers
        time.sleep(1)

    return results

if __name__ == "__main__":
    print(fetch_web_sources("edgedb database", limit=1)[0][0])

