from playwright.sync_api import sync_playwright, expect

def verify_code_splitting():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        # Using default vite port 5173
        try:
            page.goto("http://localhost:5173", timeout=30000)

            # Wait for the login page to be visible
            # Login page has "Sign In (v3)" button
            expect(page.get_by_role("button", name="Sign In (v3)")).to_be_visible(timeout=10000)

            # Take screenshot of the login page
            page.screenshot(path="verification_login.png")
            print("Login page verified and screenshot taken.")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_code_splitting()
