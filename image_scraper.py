import os
import asyncio
import requests
from playwright.async_api import async_playwright
from urllib.parse import urljoin, urlparse
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO, filename='image_scraper.log', filemode='w',
                    format='%(asctime)s - %(levelname)s - %(message)s')

# URL of the website
url = 'https://www.popmart.com/'

# Directory to save images
save_dir = os.path.join(os.getcwd(), 'www', 'images')
os.makedirs(os.path.dirname(save_dir), exist_ok=True)
os.makedirs(save_dir, exist_ok=True)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            logging.info(f"Navigating to page: {url}")
            print(f"Navigating to page: {url}")
            await page.goto(url, wait_until='networkidle', timeout=90000)

            logging.info("Scrolling down to load all images...")
            print("Scrolling down to load all images...")
            
            # Get scroll height
            last_height = await page.evaluate('document.body.scrollHeight')

            while True:
                # Scroll down to bottom
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight);')
                # Wait to load page
                await page.wait_for_timeout(3000)
                # Calculate new scroll height and compare with last scroll height
                new_height = await page.evaluate('document.body.scrollHeight')
                if new_height == last_height:
                    break
                last_height = new_height

            await page.screenshot(path='screenshot.png', full_page=True)
            logging.info("Screenshot taken: screenshot.png")
            print("Screenshot taken: screenshot.png") 

            logging.info("Finding images...")
            print("Finding images...")
            
            img_srcs = await page.evaluate("() => Array.from(document.querySelectorAll('img')).map(img => img.src)")
            
            logging.info(f"Found {len(img_srcs)} images. Downloading...")
            print(f"Found {len(img_srcs)} images. Downloading...")

            for img_url in set(img_srcs):
                if not img_url:
                    continue
                
                img_url = urljoin(url, img_url)

                if img_url.startswith('data:'):
                    logging.info(f"Skipping data URL: {img_url[:30]}...")
                    continue
                
                try:
                    img_response = requests.get(img_url, stream=True, timeout=20)
                    img_response.raise_for_status()

                    filename = os.path.basename(urlparse(img_url).path)
                    if not filename:
                        filename = f"{abs(hash(img_url))}.jpg"
                    
                    # Sanitize filename to prevent path issues
                    filename = "".join([c for c in filename if c.isalpha() or c.isdigit() or c in ('.', '_', '-')]).rstrip()
                    if not filename:
                        filename = f"{abs(hash(img_url))}.jpg"

                    save_path = os.path.join(save_dir, filename)

                    with open(save_path, 'wb') as f:
                        for chunk in img_response.iter_content(1024):
                            f.write(chunk)
                    logging.info(f"Saved: {save_path}")
                    print(f"Saved: {filename}")

                except Exception as e:
                    logging.error(f"Could not download {img_url}. Error: {e}")
                    # print(f"Could not download {img_url}. Error: {e}")

        except Exception as e:
            logging.critical(f"An error occurred during Playwright process: {e}")
            print(f"An error occurred during Playwright process: {e}")
        finally:
            await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
    print("\nImage scraping finished.")

