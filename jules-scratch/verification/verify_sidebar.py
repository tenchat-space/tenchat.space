from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # Wait for the sidebar to load
    page.wait_for_selector('[title="Chats"]')

    # Click on Stories and take a screenshot
    page.locator('[title="Stories"]').click()
    page.screenshot(path="jules-scratch/verification/stories_panel.png")

    # Click on Channels and take a screenshot
    page.locator('[title="Channels"]').click()
    page.screenshot(path="jules-scratch/verification/channels_panel.png")

    # Take a final screenshot of the whole page
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
