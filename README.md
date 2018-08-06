World clock tab is totally inspired by [clocktab.com](http://www.clocktab.com/), with UTC offset and digital/analog clock support.

[Demo site](https://i-namekawa.github.io/worldclocktab/)

Made with no google service (No ads/tracking. Only cookie for settings).

## How to use

Click on the map to pick a timezone. UTC offset and sunrise/sunset times will be automatically calculated.

With the checkboxes, you can toggle between 12-hr/24-hr, digital/analog clock, show/hide favicon canvas, 
and on/off API call to sunrise-sunset.org for more accurate dawn/dusk calculation.
After you're done with settings, just pin the tab!

Background images for website and favicon will change according to the time of day (dawn, day, dusk, night).
When sunrise-sunset.org API call is turned off, twilight duration is fixed to 60 min.
If you need multiple cities, just fire up more tabs!

Once loaded, you can still use this site offline. All you need to do is to turn off API call to sunrise-sunset.org 
and set the latitude/longitude manually in the input fields. UCT offset/sunrise/sunset times will be automatically updated.
However, the estimation of senset/sunrise/dawn/dusk may not be accurate for the arctic circle.

## Acknowledgement

World clock tab is powered by:
- JQuery
- bootstrap
- [leafletjs.com](https://leafletjs.com/) for emmbedding the interactive map
- [www.openstreetmap.org](https://openstreetmap.org/) for map tile data
- [tz.js by darkskyapp](https://github.com/darkskyapp/tz-lookup/) for timezone look up from lat/lng
- [www.geonames.org](https://www.geonames.org/) for time zone Id and UCT offset data
- [Leaflet.Sun plugin by dj0001](https://github.com/dj0001/Leaflet.Sun) for offline sunrise/sunset time calculation
- [sunrise-sunset.org](https://sunrise-sunset.org/) for sunrise/sunset/dawn/dusk
- [www.reshot.com](https://www.reshot.com/) for background images
