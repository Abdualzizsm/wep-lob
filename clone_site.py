from site_cloner import SiteCloner

# The URL of the website to clone
url = 'https://www.popmart.com/'

print(f"Starting to clone {url}")

try:
    # Initialize the cloner with the URL and clone it.
    sc = SiteCloner(url)
    sc.clone_website()
    
    print("Website cloned successfully!")
    print(f"Files should be saved in a directory named after the website (e.g., www.popmart.com).")

except Exception as e:
    print(f"An error occurred: {e}")
