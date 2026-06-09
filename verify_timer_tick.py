
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 2000})
        page = await context.new_page()
        await page.goto('http://localhost:5173/Troop242/')
        await page.wait_for_selector('text=Upcoming Events')

        # Scroll to events
        events_locator = page.locator('text=Upcoming Events')
        await events_locator.scroll_into_view_if_needed()

        # Screenshot 1
        await page.screenshot(path='/home/jules/verification/events_1.png')

        # Wait 2 seconds
        await asyncio.sleep(2)

        # Screenshot 2
        await page.screenshot(path='/home/jules/verification/events_2.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
