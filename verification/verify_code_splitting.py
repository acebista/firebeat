from playwright.sync_api import sync_playwright

def verify_code_splitting():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to http://localhost:4173")
            page.goto("http://localhost:4173")

            # Wait for content to load. Since we saw in the screenshot that it loads the login form,
            # and the input has placeholder "Enter email or 10-digit phone", we can look for that.
            print("Waiting for login form...")

            # Use a more specific selector found in the code or use the placeholder text
            page.wait_for_selector('input[placeholder="Enter email or 10-digit phone"]', timeout=10000)

            # Take a screenshot
            page.screenshot(path="verification/login_page.png")
            print("Screenshot taken: verification/login_page.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_state_2.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_code_splitting()
