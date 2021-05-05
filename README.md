# WP Coupons #

**Contributors:** josefwittmann
**Tags:** coupon, coupons
**Requires at least:** 5.3
**Tested up to:** 5.5
**Requires PHP:** 7.1
**Stable tag:** 0.1.0
**License:** GPLv2 or later
**License URI:** https://www.gnu.org/licenses/gpl-2.0.html

Distribute unique coupons to your users.

## Description ##

Allows you to upload a set of coupon codes you want to distribute to your users. Each coupon is assumed to be used only once.

You can manage multiple sets of coupons from different sources.

Your users are shown a popup next time they visit the site. They have are only shown the coupon after clicking a button, to ensure interest.

## Installation ##

Install like any plugin (via wp-admin or uploading the plugin manually).

You'll find a new menu item in the admin area near the bottom called 'Coupons'. All administration is done from there.

## Usage ##

After installing, you'll find a new menu item in the admin area near the bottom called 'Coupons'. All administration is done from there.

There are _coupons_ and _(coupon) groups_.
Each coupon belongs to exactly one group and has a value and expiry date.
A group contains many coupons and defines the template that is shown to the users within a popup. By default, only logged in users can get coupons.

Start by creating a new group. Give it an unique name and write out the template.
There are four buttons in the editor, which mark the speical areas for the popup. Highlight the according text and press the button to mark it up.

-   **Action button**: When this button is clicked, the coupon's value will be fetched from the backend and displayed.
-   **Success area**: This area is hidden until the coupon is fetched from the backend.
-   **Coupon value**: This area will be _replaced_ with the coupon's value. Make sure to not include trailing whitespace, otherwise it may look ugly.
-   **Expiry date**: This area will be _replaced_ with the coupon's expiry date. Make sure to not include trailing whitespace, otherwise it may look ugly.

Save the group and add some coupons. You can add multiple coupons with the same expiry date. Just make sure that every coupon gets its own line (empty lines are ignored).

Now you're ready to go. But you may want to have a look at the default settings. There you can adjust delays between events to not spam your users.

## Customization ##

Most of the user-facing customization can be done in the group editor. If you want to change the users which should be able to get coupons, you can hook into the `wp_coupons_user_is_authorized_for_coupons` filter. Currently, there is no way to distribute coupons to anonymous users (keeping track is done server-side). So even if you allow this through this filter, it will not work.

## Shortcomings/Bugs ##

-   There is no way to preview the popup. This is one of the next feature, I'll work on.
    In the meantime, copy the content into a post and inspect it there.
-   Because the group determines the popup's content, the group has to be decided for on page load. When there is only one coupon left and two users visit a page simultaneously, one gets the coupon and the other one will get an empty message.
    A proper error message will be shown in an upcoming version. And I'm also planning on reserving coupons, when a user visits a page, to avoid this race condition all together.
-   Activation and deactivation hooks are missing. Data from this plugin will stay around after deleting it for now.
-   You can't explicitly filter when the popup shouldn't be shown. The best workaround is to hook into `wp_coupons_user_is_authorized_for_coupons`.

## Contributing ##

The source code is hosted on [Josef37/wp-coupons](https://github.com/Josef37/wp-coupons).
Feel free to create a new issue, when you have questions or feature requests, or consider making a pull request.
There is a separate [developer README](https://github.com/Josef37/wp-coupons/blob/main/README_DEV.md), which helps you set up the development environment.

If this plugin helped you in any way, I'd like to hear your feedback.
