from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Verify login page
    page.goto("http://localhost:3000/en/auth/login")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/login-page.png")

    # Verify register page
    page.goto("http://localhost:3000/en/auth/register")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/register-page.png")

    # Verify forgot password page
    page.goto("http://localhost:3000/en/auth/forgot-password")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/forgot-password-page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)