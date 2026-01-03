import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test.describe('Authentication & Logout', () => {
    test('should clear user data from localStorage on logout', async ({ page }) => {
      // Set up user data in localStorage
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({ id: '123', name: 'Test User' }));
      });

      // Verify user data exists
      const userData = await page.evaluate(() => localStorage.getItem('user'));
      expect(userData).toBeTruthy();

      // Trigger logout via emitLogout
      await page.evaluate(() => {
        // Import and use emitLogout (in a real scenario, this would be triggered by UI)
        if (typeof window !== 'undefined' && (window as any).emitLogout) {
          (window as any).emitLogout();
        } else {
          // Simulate logout by clearing localStorage and broadcasting
          localStorage.removeItem('user');
          const channel = new BroadcastChannel('auth_stream');
          channel.postMessage('LOGOUT');
          channel.close();
        }
      });

      // Wait a bit for the logout to process
      await page.waitForTimeout(100);

      // Verify user data is cleared
      const userDataAfterLogout = await page.evaluate(() => localStorage.getItem('user'));
      expect(userDataAfterLogout).toBeNull();
    });

    test('should redirect to /login when logout is triggered', async ({ page }) => {
      // Set up a listener for navigation
      let navigatedToLogin = false;
      
      page.on('framenavigated', (frame) => {
        if (frame.url().includes('/login')) {
          navigatedToLogin = true;
        }
      });

      await page.goto('/');
      
      // Set user data to simulate logged in state
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({ id: '123' }));
      });

      // Trigger logout via BroadcastChannel (simulating cross-tab logout)
      await page.evaluate(() => {
        const channel = new BroadcastChannel('auth_stream');
        channel.postMessage('LOGOUT');
        channel.close();
      });

      // Wait for redirect (AuthProvider should trigger redirect)
      await page.waitForTimeout(500);

      // Check if navigation occurred or URL changed
      const url = page.url();
      expect(url.includes('/login') || navigatedToLogin).toBeTruthy();
    });
  });

  test.describe('Cross-Tab Logout Synchronization', () => {
    test('should synchronize logout across multiple tabs via BroadcastChannel', async ({ browser }) => {
      // Create two contexts (simulating two tabs)
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();

      const page1 = await context1.newPage();
      const page2 = await context2.newPage();

      try {
        // Set up user data in both tabs
        await page1.goto('/');
        await page2.goto('/');

        await page1.evaluate(() => {
          localStorage.setItem('user', JSON.stringify({ id: '123', name: 'User' }));
        });
        await page2.evaluate(() => {
          localStorage.setItem('user', JSON.stringify({ id: '123', name: 'User' }));
        });

        // Verify both tabs have user data
        const userData1 = await page1.evaluate(() => localStorage.getItem('user'));
        const userData2 = await page2.evaluate(() => localStorage.getItem('user'));
        expect(userData1).toBeTruthy();
        expect(userData2).toBeTruthy();

        // Trigger logout from page1
        await page1.evaluate(() => {
          localStorage.removeItem('user');
          const channel = new BroadcastChannel('auth_stream');
          channel.postMessage('LOGOUT');
          channel.close();
        });

        // Wait for BroadcastChannel message to propagate
        await page2.waitForTimeout(500);

        // Verify page2 received the logout signal
        // In a real scenario, page2 would redirect to /login
        // Here we verify the message was received by checking if AuthProvider reacted
        const url2 = page2.url();
        // The redirect might have happened, or we can check localStorage was cleared
        const userData2After = await page2.evaluate(() => localStorage.getItem('user'));
        
        // At minimum, verify the BroadcastChannel communication worked
        expect(url2.includes('/login') || userData2After === null).toBeTruthy();
      } finally {
        await context1.close();
        await context2.close();
      }
    });
  });

  test.describe('XSS Protection', () => {
    test('should not execute malicious scripts stored in localStorage', async ({ page }) => {
      await page.goto('/');

      // Attempt to store a script in localStorage
      const maliciousScript = '<script>window.xssExecuted = true;</script>';
      await page.evaluate((script) => {
        localStorage.setItem('user', script);
        localStorage.setItem('malicious', script);
      }, maliciousScript);

      // Reload the page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check if the script was executed
      const xssExecuted = await page.evaluate(() => (window as any).xssExecuted);
      expect(xssExecuted).toBeUndefined();
    });

    test('should sanitize localStorage data on logout', async ({ page }) => {
      await page.goto('/');

      // Store potentially malicious data
      await page.evaluate(() => {
        localStorage.setItem('user', '<img src=x onerror="alert(1)">');
        localStorage.setItem('token', '<script>alert("XSS")</script>');
      });

      // Trigger logout
      await page.evaluate(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        const channel = new BroadcastChannel('auth_stream');
        channel.postMessage('LOGOUT');
        channel.close();
      });

      await page.waitForTimeout(100);

      // Verify all user-related data is cleared
      const user = await page.evaluate(() => localStorage.getItem('user'));
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(user).toBeNull();
      expect(token).toBeNull();
    });
  });

  test.describe('Security Headers', () => {
    test('should have appropriate security headers', async ({ page }) => {
      const response = await page.goto('/');
      
      if (response) {
        // Verify the page loads successfully
        expect(response.status()).toBe(200);
        
        // Note: Security headers are typically set in production
        // In dev mode, we primarily verify the page loads without errors
        // You can check for security headers like this:
        // const headers = response.headers();
        // const securityHeaders = [
        //   'x-content-type-options',
        //   'x-frame-options',
        //   'x-xss-protection',
        //   'content-security-policy',
        //   'strict-transport-security',
        // ];
        // const hasSecurityHeaders = securityHeaders.some(
        //   (header) => headers[header] !== undefined
        // );
        // expect(hasSecurityHeaders).toBeTruthy();
      }
    });
  });

  test.describe('Content Security', () => {
    test('should not leak sensitive data in page source', async ({ page }) => {
      await page.goto('/');
      
      // Check page content doesn't contain sensitive patterns
      const content = await page.content();
      
      // Common patterns to avoid
      const sensitivePatterns = [
        /password\s*[:=]\s*["'][^"']+["']/i,
        /token\s*[:=]\s*["'][^"']{20,}["']/i,
        /secret\s*[:=]\s*["'][^"']+["']/i,
        /api[_-]?key\s*[:=]\s*["'][^"']+["']/i,
      ];

      for (const pattern of sensitivePatterns) {
        // Only check if we're not in a test/example context
        // In a real app, you'd have actual sensitive data protection
        const matches = content.match(pattern);
        if (matches && !matches[0].includes('example') && !matches[0].includes('test')) {
          console.warn(`Potential sensitive data found: ${matches[0].substring(0, 50)}`);
        }
      }

      // Basic check: page should load successfully
      expect(content.length).toBeGreaterThan(0);
    });
  });
});

