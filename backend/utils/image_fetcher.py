import os
import requests

def get_wikipedia_image(query):
    try:
        search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&format=json&srlimit=1"
        search_res = requests.get(search_url, timeout=5)
        if search_res.status_code == 200:
            search_data = search_res.json()
            if search_data.get("query", {}).get("search"):
                exact_title = search_data["query"]["search"][0]["title"]
                search_query = exact_title.replace(' ', '_')
                url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{search_query}"
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    thumbnail = data.get("thumbnail", {}).get("source")
                    if thumbnail:
                        return thumbnail.replace('/320px-', '/800px-').replace('/200px-', '/800px-')
    except Exception:
        pass
    return None

def get_place_image(query):
    clean_query = query.strip()
    api_key = os.getenv("UNSPLASH_ACCESS_KEY")
    if api_key:
        try:
            url = f"https://api.unsplash.com/search/photos?query={clean_query}&orientation=landscape&per_page=1&client_id={api_key}"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get("results"):
                    return data["results"][0]["urls"]["regular"]
        except Exception:
            pass
    
    wiki_img = get_wikipedia_image(clean_query)
    if wiki_img:
        return wiki_img
    
    formatted_query = clean_query.replace(' ', ',')
    return f"https://loremflickr.com/800/600/{formatted_query}"

def get_unsplash_image(query):
    return get_place_image(query)
