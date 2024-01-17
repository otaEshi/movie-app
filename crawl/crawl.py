from selenium import webdriver
from bs4 import BeautifulSoup
import time, json

def get_video_info(driver, url):
    driver.get(url)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    script = soup.find("script", attrs={"type":"application/ld+json"})
    details = json.loads(script.string)

    title = details.get("name")
    description = details.get("description")
    thumbnailUrl = details.get("thumbnailUrl")[0]
    url = details.get("url")

    return {"title": title, "description": description,"thumbnail_url": thumbnailUrl, "url": url}

def search_keyword(keyword):
    driver = webdriver.Chrome()  # initiate a driver, in this case Chrome
    driver.get('https://www.youtube.com/results?search_query=' + keyword) # go to the URL

    videos = []
    while len(videos) < 20:
        driver.execute_script("window.scrollBy(0, 1080)") # scroll down
        time.sleep(2) # wait for new videos to load
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        video_tags = soup.findAll('a', attrs={'id': 'video-title'})
        print(len(video_tags))
        
        for vtag in video_tags[:20-len(videos)]:
            url = 'https://www.youtube.com' + vtag['href']
            videos.append(get_video_info(driver, url))
    driver.close()
    return videos

def main():
    keyword = "what"
    data = search_keyword(keyword)
    for video in data:
        print(video)

if __name__ == "__main__":
    main()