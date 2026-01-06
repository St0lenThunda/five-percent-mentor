import { test, expect } from '@playwright/test';

test.describe( 'Mastery Display Verification', () => {
  test.beforeEach( async ( { page } ) => {
    test.setTimeout( 60000 );

    // Mock session to avoid redirect
    await page.route( '**/neondb/auth/get-session', async ( route ) => {
      await route.fulfill( {
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify( {
          user: { id: 'test-user-id', email: 'test@example.com', name: 'Test User' }
        } )
      } );
    } );

    // Mock profile fetch
    await page.route( '**/v1/sql', async ( route ) => {
      // Just return empty results for everything else by default
      await route.fulfill( { status: 200, body: JSON.stringify( [] ) } );
    } );
  } );

  test( 'dashboard renders mastery rings correctly', async ( { page } ) => {
    await page.goto( '/' );

    // If it still redirects, we handle it once
    if ( page.url().includes( '/login' ) ) {
      await page.fill( 'input[id="email"]', 'test@example.com' );
      await page.fill( 'input[id="password"]', 'password123' );
      await page.click( 'button:has-text("Sign In")' );
      await page.waitForURL( /\// );
    }

    // Wait for curriculum grid
    const unit = page.locator( '.curriculum-card' ).first(); // Assuming class or similar
    // Let's use text instead since we know the labels
    await expect( page.locator( 'text=Supreme Mathematics' ) ).toBeVisible( { timeout: 20000 } );

    // Check for mastery rings (svg or canvas)
    const rings = page.locator( 'svg' ); // MasteryRing.vue uses SVG
    await expect( rings.first() ).toBeVisible();

    console.log( 'Mastery Rings detected on Dashboard.' );
    await page.screenshot( { path: 'mastery-dashboard.png' } );
  } );
} );
