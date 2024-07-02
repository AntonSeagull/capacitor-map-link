# capacitor-map-link

Open the map app of the user's choice with a specific location.

## Adding URL Schemes to `Info.plist`

To ensure your app can properly handle URL schemes, you need to add the required schemes to the `Info.plist` file of your iOS project. This allows the app to check and open URLs with these schemes.

### Example `Info.plist`

Here is an example of how your `Info.plist` should look with the URL schemes added:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    ...
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>maps</string>
        <string>comgooglemaps</string>
        <string>citymapper</string>
        <string>uber</string>
        <string>lyft</string>
        <string>transit</string>
        <string>truckmap</string>
        <string>waze</string>
        <string>yandexnavi</string>
        <string>moovit</string>
        <string>yandexmaps</string>
        <string>yandextaxi</string>
        <string>kakaomap</string>
        <string>tmap</string>
        <string>szn-mapy</string>
        <string>mapsme</string>
        <string>osmandmaps</string>
        <string>gett</string>
        <string>nmap-disabled</string>
        <string>dgis</string>
        <string>lftgpas</string>
        <string>petalmaps</string>
        <string>com.sygic.aura</string>
    </array>
    ...
</dict>
</plist>
```

## Install

```bash
npm install capacitor-map-link
npx cap sync
```

## API

<docgen-index>

* [`showLocation(...)`](#showlocation)
* [`getApps(...)`](#getapps)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### showLocation(...)

```typescript
showLocation(options: ShowLocationProps) => Promise<any>
```

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#showlocationprops">ShowLocationProps</a></code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### getApps(...)

```typescript
getApps(options: GetAppsProps) => Promise<GetAppsResponse[]>
```

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#showlocationprops">ShowLocationProps</a></code> |

**Returns:** <code>Promise&lt;GetAppsResponse[]&gt;</code>

--------------------


### Interfaces


#### ShowLocationProps

| Prop                      | Type                                                                                                                      | Description                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **`latitude`**            | <code>string \| number</code>                                                                                             |                                                                    |
| **`longitude`**           | <code>string \| number</code>                                                                                             |                                                                    |
| **`address`**             | <code>string \| null</code>                                                                                               | latitude and longitude will be ignored if the address field is set |
| **`sourceLatitude`**      | <code>number \| null</code>                                                                                               |                                                                    |
| **`sourceLongitude`**     | <code>number \| null</code>                                                                                               |                                                                    |
| **`appleIgnoreLatLon`**   | <code>boolean</code>                                                                                                      |                                                                    |
| **`alwaysIncludeGoogle`** | <code>boolean</code>                                                                                                      |                                                                    |
| **`googleForceLatLon`**   | <code>boolean</code>                                                                                                      |                                                                    |
| **`googlePlaceId`**       | <code>string \| number</code>                                                                                             |                                                                    |
| **`title`**               | <code>string \| null</code>                                                                                               |                                                                    |
| **`app`**                 | <code><a href="#mapid">MapId</a> \| null</code>                                                                           |                                                                    |
| **`dialogTitle`**         | <code>string \| null</code>                                                                                               |                                                                    |
| **`dialogMessage`**       | <code>string \| null</code>                                                                                               |                                                                    |
| **`cancelText`**          | <code>string \| null</code>                                                                                               |                                                                    |
| **`appsWhiteList`**       | <code>string[] \| null</code>                                                                                             |                                                                    |
| **`appTitles`**           | <code><a href="#partial">Partial</a>&lt;<a href="#record">Record</a>&lt;<a href="#mapid">MapId</a>, string&gt;&gt;</code> |                                                                    |
| **`naverCallerName`**     | <code>string</code>                                                                                                       |                                                                    |
| **`directionsMode`**      | <code><a href="#directionmode">DirectionMode</a></code>                                                                   |                                                                    |


### Type Aliases


#### MapId

<code>'apple-maps' | 'google-maps' | 'citymapper' | 'uber' | 'lyft' | 'transit' | 'truckmap' | 'waze' | 'yandex' | 'moovit' | 'yandex-maps' | 'yandex-taxi' | 'kakaomap' | 'tmap' | 'mapycz' | 'maps-me' | 'osmand' | 'gett' | 'navermap' | 'dgis' | 'liftago' | 'petalmaps' | 'sygic'</code>


#### Partial

Make all properties in T optional

<code>{ [P in keyof T]?: T[P]; }</code>


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>


#### DirectionMode

<code>'car' | 'walk' | 'public-transport' | 'bike'</code>


#### GetAppsResponse

<code>{ id: <a href="#mapid">MapId</a>; name: string; /** function to link user to map app */ open: () =&gt; Promise&lt;string | null&gt;; }</code>


#### GetAppsProps

<code><a href="#showlocationprops">ShowLocationProps</a></code>

</docgen-api>
