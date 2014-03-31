jQuery Date Plugin
===========

Small date wrapper around Microsoft's jQuery globalization plugin.

I'm sure there are better solutions out there by now that don't rely on jQuery or jQuery Globalization, but a lot of people keep asking me where this code went so I posted it.

See the [blog post](http://marcgrabanski.com/articles/jquery-date-plugin)

Examples

```javascript

$.date().adjust("M", +3).format("yyyy-dd-MM"); // same as .setFormat("yyyy-dd-MM").format()

$.date().adjust("M", +3).format();

$.date().adjust("D", -3).format();

$.date("October 1, 1984", "MMMM dd, yyyy").adjust("M", 3).adjust("Y", 5).adjust("D", -1).format();

$.preferCulture("ar");

$.date().adjust("M", +3).format();

```