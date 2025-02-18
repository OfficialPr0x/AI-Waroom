import { Sandbox } from "@e2b/sdk";

export async function setupScraper() {
  const sandbox = await Sandbox.create({
    template: "Python3",
    apiKey: import.meta.env.VITE_E2B_API_KEY,
  });

  await sandbox.writeFile(
    "/app/scraper.py",
    `
import requests
from bs4 import BeautifulSoup
import os
import json
from urllib.parse import urljoin, urlparse

def scrape_url(url, max_depth=2, current_depth=0, visited=None):
    if visited is None:
        visited = set()
    
    if current_depth > max_depth or url in visited:
        return
    
    visited.add(url)
    print(f"[INFO] Scraping {url}")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Create directory for the domain
        domain = urlparse(url).netloc
        base_dir = f'scraped_data/{domain}'
        os.makedirs(base_dir, exist_ok=True)
        
        # Save HTML
        with open(f'{base_dir}/index.html', 'w') as f:
            f.write(soup.prettify())
        
        # Extract and save CSS
        css_links = soup.find_all('link', rel='stylesheet')
        for css in css_links:
            css_url = urljoin(url, css.get('href', ''))
            try:
                css_content = requests.get(css_url).text
                css_filename = os.path.basename(urlparse(css_url).path)
                with open(f'{base_dir}/{css_filename}', 'w') as f:
                    f.write(css_content)
            except:
                print(f"[ERROR] Failed to download CSS: {css_url}")
        
        # Extract and save images
        os.makedirs(f'{base_dir}/images', exist_ok=True)
        images = soup.find_all('img')
        for img in images:
            img_url = urljoin(url, img.get('src', ''))
            try:
                img_content = requests.get(img_url).content
                img_filename = os.path.basename(urlparse(img_url).path)
                with open(f'{base_dir}/images/{img_filename}', 'wb') as f:
                    f.write(img_content)
            except:
                print(f"[ERROR] Failed to download image: {img_url}")
        
        # Recursively scrape links
        if current_depth < max_depth:
            links = soup.find_all('a')
            for link in links:
                next_url = urljoin(url, link.get('href', ''))
                if urlparse(next_url).netloc == urlparse(url).netloc:
                    scrape_url(next_url, max_depth, current_depth + 1, visited)
        
        print(f"[SUCCESS] Completed scraping {url}")
        
    except Exception as e:
        print(f"[ERROR] Failed to scrape {url}: {str(e)}")

if __name__ == '__main__':
    import sys
    url = sys.argv[1]
    max_depth = int(sys.argv[2])
    scrape_url(url, max_depth)
`,
  );

  await sandbox.writeFile("/app/requirements.txt", "requests\nbeautifulsoup4");
  await sandbox.installPythonRequirements("/app/requirements.txt");

  return sandbox;
}

export async function runScraper(url: string, depth: number = 2) {
  const sandbox = await setupScraper();
  const process = await sandbox.run({
    cmd: `python /app/scraper.py "${url}" ${depth}`,
  });

  return {
    process,
    sandbox,
  };
}
