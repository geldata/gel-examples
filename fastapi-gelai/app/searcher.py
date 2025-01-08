import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus
import time
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}


def search_google(query: str, limit: int = 5) -> list[str]:
    """
    Perform a Google search and return top URLs.
    """

    encoded_query = quote_plus(query)  # encode the search query
    search_url = f"https://www.google.com/search?q={encoded_query}"

    try:
        response = requests.get(search_url, headers=HEADERS)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        result_block = soup.find_all("div", attrs={"class": "g"})

        search_results = []

        for result in result_block:
            link = result.find("a", href=True)
            title = result.find("h3")

            if link and title:
                link = result.find("a", href=True)
                if link["href"] not in search_results:
                    search_results.append(link["href"])

                    if len(search_results) >= limit:
                        break

        return search_results

    except requests.exceptions.RequestException as e:
        print(f"Error performing search: {e}")
        return []


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


def fetch_text_results(query: str, limit: int = 5) -> list[tuple[str, str]]:
    """
    Perform search and extract text from results.
    Returns list of (url, text_content) tuples.
    """
    results = []
    urls = search_google(query, limit)

    for url in urls:
        text = extract_text_from_url(url)
        if text:  # Only include if we got some text
            results.append((url, text))
        # Be nice to servers
        time.sleep(1)

    return results
