
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 2000})
        page = await context.new_page()

        # Navigate to the home page
        await page.goto('http://localhost:5173/Troop242/')

        # Wait for the page to load
        await page.wait_for_selector('text=Upcoming Events')

        # Scroll to Upcoming Events
        await page.locator('text=Upcoming Events').scroll_into_view_if_needed()

        # Capture initial state of the countdown
        await page.screenshot(path='/home/jules/verification/events_initial.png')

        # Wait for 3 seconds to let the timer tick
        await asyncio.sleep(3)

        # Capture state after delay
        await page.screenshot(path='/home/jules/verification/events_after_delay.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
