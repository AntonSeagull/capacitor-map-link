import { AppLauncher } from '@capacitor/app-launcher';
import { WebPlugin } from '@capacitor/core';
import type {
  CapMapLinkPlugin,
  GetAppsProps,
  GetAppsResponse,
  ShowLocationProps,
} from './definitions';

import { Capacitor } from '@capacitor/core';
import { MapId } from './definitions';

import {
  ActionSheet,
  ActionSheetButton,
  ActionSheetButtonStyle,
} from '@capacitor/action-sheet';

export class CapMapLinkWeb extends WebPlugin implements CapMapLinkPlugin {
  async showLocation({
    latitude,
    longitude,
    address,
    sourceLatitude,
    sourceLongitude,
    appleIgnoreLatLon,
    alwaysIncludeGoogle,
    googleForceLatLon,
    googlePlaceId,
    title: customTitle,
    app: customApp,
    dialogTitle: customDialogTitle,
    dialogMessage: customDialogMessage,
    cancelText: customCancelText,
    appsWhiteList: customAppsWhiteList,
    appTitles,
    naverCallerName,
    directionsMode,
  }: ShowLocationProps): Promise<any> {
    const prefixes = generatePrefixes({
      alwaysIncludeGoogle,
      naverCallerName,
    });

    checkOptions({
      latitude,
      longitude,
      address,
      googleForceLatLon,
      googlePlaceId,
      title: customTitle,
      app: customApp,
      prefixes,
      appTitles,
      appsWhiteList: customAppsWhiteList,
    });

    let useSourceDestiny = false;
    let sourceLat;
    let sourceLng;
    let sourceLatLng;
    let fullAddress;

    if (sourceLatitude != null && sourceLongitude != null) {
      useSourceDestiny = true;
      sourceLat =
        typeof sourceLatitude === 'string'
          ? parseFloat(sourceLatitude)
          : sourceLatitude;
      sourceLng =
        typeof sourceLongitude === 'string'
          ? parseFloat(sourceLongitude)
          : sourceLongitude;
      sourceLatLng = `${sourceLat},${sourceLng}`;
    }

    if (address) {
      fullAddress = encodeURIComponent(address);
    }

    const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
    const lng =
      typeof longitude === 'string' ? parseFloat(longitude) : longitude;
    const latlng = `${lat},${lng}`;
    const title = customTitle && customTitle.length ? customTitle : null;
    const encodedTitle = encodeURIComponent(title ?? '');
    let app = customApp && customApp.length ? customApp : null;
    const dialogTitle =
      customDialogTitle && customDialogTitle.length
        ? customDialogTitle
        : 'Open in Maps';
    const dialogMessage =
      customDialogMessage && customDialogMessage.length
        ? customDialogMessage
        : 'What app would you like to use?';
    const cancelText =
      customCancelText && customCancelText.length ? customCancelText : 'Cancel';
    const appsWhiteList =
      customAppsWhiteList && customAppsWhiteList.length
        ? customAppsWhiteList
        : null;

    if (!app) {
      app = await askAppChoice({
        dialogTitle,
        dialogMessage,
        cancelText,
        appsWhiteList,
        prefixes,
        appTitles: generateTitles(appTitles || {}) as Record<string, string>,
      });
    }

    const url = generateMapUrl({
      app,
      directionsMode,
      appleIgnoreLatLon,
      googleForceLatLon,
      googlePlaceId,
      naverCallerName,
      lat,
      lng,
      latlng,
      sourceLat,
      sourceLng,
      sourceLatLng,
      address: fullAddress,
      title,
      encodedTitle,
      prefixes,
      useSourceDestiny,
    });

    if (url !== '') {
      AppLauncher.canOpenUrl({ url })
        .then(() => {
          AppLauncher.openUrl({ url }).then(() => Promise.resolve(app));
        })
        .catch(() => {
          console.error(`Error opening ${app} with url: ${url}`);
        });
    }
  }

  async getApps({
    alwaysIncludeGoogle,
    appsWhiteList,
    appTitles,
    naverCallerName,
    ...rest
  }: GetAppsProps): Promise<GetAppsResponse[]> {
    let apps = await getAvailableApps(
      generatePrefixes({ alwaysIncludeGoogle, naverCallerName }),
    );

    if (appsWhiteList && appsWhiteList.length) {
      checkNotSupportedApps(appsWhiteList);
      apps = apps.filter(appName => appsWhiteList!.includes(appName));
    }

    const titles = generateTitles(appTitles || {}) as Record<string, string>;
    const open = (app: MapId) => {
      return this.showLocation({
        ...rest,
        app,
        alwaysIncludeGoogle,
        appsWhiteList,
        appTitles,
        naverCallerName,
      });
    };

    const list: GetAppsResponse[] = [];
    for (const app of apps) {
      list.push({
        id: app,
        name: titles[app],
        open: () => open(app),
      });
    }

    return list;
  }
}

export const isIOS: boolean = Capacitor.getPlatform() === 'ios';

export const appKeys: MapId[] = [
  'apple-maps',
  'google-maps',
  'citymapper',
  'uber',
  'lyft',
  'transit',
  'truckmap',
  'waze',
  'yandex',
  'moovit',
  'yandex-taxi',
  'yandex-maps',
  'kakaomap',
  'tmap',
  'mapycz',
  'maps-me',
  'osmand',
  'gett',
  'navermap',
  'dgis',
  'liftago',
  'petalmaps',
  'sygic',
];

export const checkOptions = ({
  latitude,
  longitude,
  address,
  googleForceLatLon,
  googlePlaceId,
  title,
  app,
  prefixes,
  appTitles,
  appsWhiteList,
}: {
  latitude?: number | string;
  longitude?: number | string;
  address?: string | null;
  googleForceLatLon?: boolean | null | undefined;
  googlePlaceId?: number | string | null | undefined;
  title?: string | null | undefined;
  app?: string | null | undefined;
  appTitles: Record<string, string> | null | undefined | any;
  prefixes: Record<string, string>;
  appsWhiteList: string[] | null | undefined;
}): void => {
  if (!(latitude && longitude) && !address) {
    throw new Error(
      '`latitude` & `longitude` or `address` is required. Both cannot be undefined.',
    );
  }
  if (address && typeof address !== 'string') {
    throw new Error('Option `address` should be of type `string`.');
  }
  if (title && typeof title !== 'string') {
    throw new Error('`title` should be of type `string`.');
  }
  if (googleForceLatLon && typeof googleForceLatLon !== 'boolean') {
    throw new Error('Option `googleForceLatLon` should be of type `boolean`.');
  }
  if (googlePlaceId && typeof googlePlaceId !== 'string') {
    throw new Error('Option `googlePlaceId` should be of type `string`.');
  }
  if (app && !(app in prefixes)) {
    throw new Error(
      'Option `app` should be undefined, null, or one of the following: "' +
        Object.keys(prefixes).join('", "') +
        '".',
    );
  }
  if (appsWhiteList && appsWhiteList.length) {
    checkNotSupportedApps(appsWhiteList);
  }
  if (appTitles && typeof appTitles !== 'object') {
    throw new Error('Option `appTitles` should be of type `object`.');
  }
};

export const getNotSupportedApps = (apps: string[]): string[] => {
  return apps.filter(app => !isSupportedApp(app));
};

export const isSupportedApp = (app: string): boolean => {
  return appKeys.includes(app as MapId);
};

export const checkNotSupportedApps = (apps: string[]): void => {
  const notSupportedApps = getNotSupportedApps(apps);
  if (notSupportedApps.length) {
    throw new Error(
      `appsWhiteList [${notSupportedApps}] are not supported apps, please provide some of the supported apps [${appKeys}]`,
    );
  }
};

export const generatePrefixes = ({
  alwaysIncludeGoogle,
  naverCallerName,
}: {
  alwaysIncludeGoogle?: boolean;
  naverCallerName?: string;
}): Record<MapId, string> => {
  return {
    'apple-maps': isIOS ? 'maps://' : 'applemaps://',
    'google-maps': prefixForGoogleMaps(alwaysIncludeGoogle),
    'citymapper': 'citymapper://',
    'uber': 'uber://',
    'lyft': 'lyft://',
    'transit': 'transit://',
    'truckmap': 'truckmap://',
    'waze': 'waze://',
    'yandex': 'yandexnavi://',
    'moovit': 'moovit://directions',
    'yandex-maps': 'yandexmaps://maps.yandex.ru/',
    'yandex-taxi': 'yandextaxi://',
    'kakaomap': 'kakaomap://',
    'tmap': 'tmap://',
    'mapycz': isIOS ? 'szn-mapy://' : 'mapycz://',
    'maps-me': 'mapsme://',
    'osmand': isIOS ? 'osmandmaps://' : 'osmand.geo://',
    'gett': 'gett://',
    'navermap': naverCallerName ? 'nmap://' : 'nmap-disabled://',
    'dgis': 'dgis://2gis.ru/',
    'liftago': 'lftgpas://',
    'petalmaps': 'petalmaps://',
    'sygic': 'com.sygic.aura://',
  };
};

export const prefixForGoogleMaps = (alwaysIncludeGoogle?: boolean): string => {
  return isIOS && !alwaysIncludeGoogle
    ? 'comgooglemaps://'
    : 'https://www.google.com/maps/';
};
export const generateTitles = (
  titles?: Partial<Record<MapId, string>> | null,
): Record<string, string> => {
  const defaultTitles: Record<MapId, string> = {
    'apple-maps': 'Apple Maps',
    'google-maps': 'Google Maps',
    'citymapper': 'Citymapper',
    'uber': 'Uber',
    'lyft': 'Lyft',
    'transit': 'The Transit App',
    'truckmap': 'TruckMap',
    'waze': 'Waze',
    'yandex': 'Yandex.Navi',
    'moovit': 'Moovit',
    'yandex-taxi': 'Yandex Taxi',
    'yandex-maps': 'Yandex Maps',
    'kakaomap': 'Kakao Maps',
    'tmap': 'TMAP',
    'mapycz': 'Mapy.cz',
    'maps-me': 'Maps Me',
    'osmand': 'OsmAnd',
    'gett': 'Gett',
    'navermap': 'Naver Map',
    'dgis': '2GIS',
    'liftago': 'Liftago',
    'petalmaps': 'Petal Maps',
    'sygic': 'Sygic',
  };

  return {
    ...defaultTitles,
    ...titles,
  };
};

export const colorsPopup = {
  black: '#464646',
  gray: '#BBC4CC',
  lightGray: '#ACBBCB',
  lightBlue: '#ECF2F8',
};

export const isAppInstalled = (
  app: string,
  prefixes: Record<string, string>,
): Promise<boolean> => {
  return new Promise<boolean>(resolve => {
    if (!(app in prefixes)) {
      return resolve(false);
    }

    AppLauncher.canOpenUrl({
      url: prefixes[app],
    })
      .then(result => {
        resolve(!!result.value);
      })
      .catch(() => {
        resolve(false);
      });
  });
};

export const getAvailableApps = async (
  prefixes: Record<string, string>,
): Promise<MapId[]> => {
  const availableApps: MapId[] = [];

  await Promise.all(
    Object.keys(prefixes).map(async app => {
      try {
        const isInstalled = await isAppInstalled(app, prefixes);
        if (isInstalled) {
          availableApps.push(app as MapId);
        }
      } catch (error) {
        console.error(`Error checking if ${app} is installed:`, error);
      }
    }),
  );

  return availableApps;
};

export const askAppChoice = ({
  dialogTitle,
  dialogMessage,
  cancelText,
  appsWhiteList,
  prefixes,
  appTitles,
}: {
  dialogTitle: string | null | undefined;
  dialogMessage: string | null | undefined;
  cancelText: string | null | undefined;
  appsWhiteList: string[] | null | undefined;
  prefixes: Record<string, string>;
  appTitles: Record<MapId, string> | null | undefined;
}): Promise<MapId | null> => {
  return new Promise(async resolve => {
    let availableApps = await getAvailableApps(prefixes);

    if (appsWhiteList && appsWhiteList.length) {
      availableApps = availableApps.filter(appName =>
        appsWhiteList.includes(appName),
      );
    }

    if (availableApps.length < 2) {
      return resolve(availableApps[0] || null);
    }

    const options: ActionSheetButton[] = availableApps.map(app => {
      return {
        title: appTitles?.[app] || '',
        style: ActionSheetButtonStyle.Default,
      };
    });

    options.push({
      title: cancelText || '',
      style: ActionSheetButtonStyle.Cancel,
    });

    const result = await ActionSheet.showActions({
      title: dialogTitle || '',
      message: dialogMessage || '',
      options: options,
    });

    if (result.index === options.length - 1) {
      return resolve(null);
    } else {
      return resolve(availableApps[result.index]);
    }
  });
};

export const getDirectionsModeSygic = (
  directionsMode: 'car' | 'walk' | 'public-transport' | 'bike' | undefined,
): string | undefined => {
  const modeMap: Record<string, string> = {
    'car': 'drive',
    'walk': 'walk',
    'public-transport': 'show',
    'bike': 'show',
  };

  return modeMap[directionsMode || ''] || undefined;
};

export const getDirectionsModeGoogleMaps = (
  directionsMode: 'car' | 'walk' | 'public-transport' | 'bike' | undefined,
): string | undefined => {
  const modeMap: Record<string, string> = {
    'car': 'driving',
    'walk': 'walking',
    'public-transport': 'transit',
    'bike': 'bicycling',
  };

  return modeMap[directionsMode || ''] || undefined;
};

export const getDirectionsModeAppleMaps = (
  directionsMode: 'car' | 'walk' | 'public-transport' | 'bike' | undefined,
): string | undefined => {
  const modeMap: Record<string, string> = {
    'car': 'd',
    'bike': 'b',
    'walk': 'w',
    'public-transport': 'r',
  };

  return modeMap[directionsMode || ''] || undefined;
};

export const generateMapUrl = ({
  app,
  directionsMode,
  appleIgnoreLatLon,
  googleForceLatLon,
  googlePlaceId,
  naverCallerName,
  lat,
  lng,
  latlng,
  sourceLat,
  sourceLng,
  sourceLatLng,
  address,
  title,
  encodedTitle,
  prefixes,
  useSourceDestiny,
}: {
  app: string | null;
  directionsMode: 'car' | 'walk' | 'public-transport' | 'bike' | undefined;
  appleIgnoreLatLon?: boolean;
  googleForceLatLon?: boolean;
  googlePlaceId: string | number | null | undefined;
  naverCallerName: string | null | undefined;
  lat?: number;
  lng?: number;
  latlng: string;
  sourceLat?: number;
  sourceLng?: number;
  sourceLatLng?: string;
  address?: string | null;
  title?: string | null;
  encodedTitle?: string;
  prefixes: Record<string, string>;
  useSourceDestiny: boolean;
}): string => {
  let url = '';

  switch (app) {
    case 'apple-maps':
      const appleDirectionMode = getDirectionsModeAppleMaps(directionsMode);
      url = prefixes['apple-maps'];
      if (address) {
        url = `${url}?address=${address}`;
      } else {
        if (useSourceDestiny || directionsMode) {
          url = `${url}?daddr=${latlng}`;
          url += sourceLatLng ? `&saddr=${sourceLatLng}` : '';
        } else if (!appleIgnoreLatLon) {
          url = `${url}?ll=${latlng}`;
        }
      }
      url +=
        useSourceDestiny || directionsMode || address || !appleIgnoreLatLon
          ? '&'
          : '?';
      url += `q=${title ? encodedTitle : 'Location'}`;
      url += appleDirectionMode ? `&dirflg=${appleDirectionMode}` : '';
      break;
    case 'google-maps':
      const googleDirectionMode = getDirectionsModeGoogleMaps(directionsMode);
      // Always using universal URL instead of URI scheme since the latter doesn't support all parameters (#155)
      if (useSourceDestiny || directionsMode) {
        // Use "dir" as this will open up directions
        url = 'https://www.google.com/maps/dir/?api=1';
        url += sourceLatLng ? `&origin=${sourceLatLng}` : '';
        if (!googleForceLatLon && title) {
          url += `&destination=${encodedTitle}`;
        } else {
          url += `&destination=${latlng}`;
        }

        url += googlePlaceId ? `&destination_place_id=${googlePlaceId}` : '';

        url += googleDirectionMode ? `&travelmode=${googleDirectionMode}` : '';
      } else {
        if (address) {
          url = `https://www.google.com/maps/search/?api=1&query=${address}`;
        } else {
          // Use "search" as this will open up a single marker
          url = 'https://www.google.com/maps/search/?api=1';

          if (!googleForceLatLon && title) {
            url += `&query=${encodedTitle}`;
          } else {
            url += `&query=${latlng}`;
          }

          url += googlePlaceId ? `&query_place_id=${googlePlaceId}` : '';
        }
      }
      break;
    case 'citymapper':
      if (address) {
        url = `${prefixes.citymapper}directions?endname=${address}`;
      } else {
        url = `${prefixes.citymapper}directions?endcoord=${latlng}`;

        if (title) {
          url += `&endname=${encodedTitle}`;
        }

        if (useSourceDestiny) {
          url += `&startcoord=${sourceLatLng}`;
        }
      }
      break;
    case 'uber':
      if (address) {
        url = `${prefixes.uber}?action=setPickup&pickup=my_location&dropoff=${address}`;
      } else {
        url = `${prefixes.uber}?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`;

        if (title) {
          url += `&dropoff[nickname]=${encodedTitle}`;
        }

        url += useSourceDestiny
          ? `&pickup[latitude]=${sourceLat}&pickup[longitude]=${sourceLng}`
          : '&pickup=my_location';
      }
      break;
    case 'lyft':
      if (address) {
        url = `${prefixes.lyft}ridetype?id=lyft&destination[address]=${address}`;
      } else {
        url = `${prefixes.lyft}ridetype?id=lyft&destination[latitude]=${lat}&destination[longitude]=${lng}`;

        if (useSourceDestiny) {
          url += `&pickup[latitude]=${sourceLat}&pickup[longitude]=${sourceLng}`;
        }
      }
      break;
    case 'transit':
      if (address) {
        url = `${prefixes.transit}directions?destination=${address}`;
      } else {
        url = `${prefixes.transit}directions?to=${latlng}`;
      }

      if (useSourceDestiny) {
        url += `&from=${sourceLatLng}`;
      }
      break;
    case 'truckmap':
      if (address) {
        // Constructed from documentation from https://truckmap.com/solutions/developer
        url = `https://truckmap.com/place/${address}`;
      } else {
        url = `https://truckmap.com/place/${lat},${lng}`;

        if (useSourceDestiny) {
          url = `https://truckmap.com/route/${sourceLat},${sourceLng}/${lat},${lng}`;
        }
      }
      break;
    case 'waze':
      if (address) {
        url = `${prefixes.waze}?q=${address}`;
      } else {
        url = `${prefixes.waze}?ll=${latlng}&navigate=yes`;
        if (title) {
          url += `&q=${encodedTitle}`;
        }
      }
      break;
    case 'yandex':
      if (address) {
        url = `${prefixes.yandex}?text=${address}`;
      } else {
        url = `${prefixes.yandex}build_route_on_map?lat_to=${lat}&lon_to=${lng}`;

        if (useSourceDestiny) {
          url += `&lat_from=${sourceLat}&lon_from=${sourceLng}`;
        }
      }
      break;
    case 'moovit':
      if (address) {
        url = `${prefixes.moovit}?dest_name=${address}`;
      } else {
        url = `${prefixes.moovit}?dest_lat=${lat}&dest_lon=${lng}`;

        if (title) {
          url += `&dest_name=${encodedTitle}`;
        }

        if (useSourceDestiny) {
          url += `&orig_lat=${sourceLat}&orig_lon=${sourceLng}`;
        }
      }
      break;
    case 'yandex-taxi':
      if (address) {
        throw new Error(
          'yandex-taxi does not support passing the address or has not been implemented yet.',
        );
      } else {
        url = `${prefixes['yandex-taxi']}route?end-lat=${lat}&end-lon=${lng}&appmetrica_tracking_id=1178268795219780156`;
      }
      break;
    case 'yandex-maps':
      if (address) {
        url = `${prefixes['yandex-maps']}?text=${address}`;
      } else {
        url = `${prefixes['yandex-maps']}?pt=${lng},${lat}`;
      }
      break;
    case 'kakaomap':
      if (address) {
        url = `${prefixes.kakaomap}route?ep=${address}`;
      } else {
        url = `${prefixes.kakaomap}look?p=${latlng}`;

        if (useSourceDestiny) {
          url = `${prefixes.kakaomap}route?sp=${sourceLat},${sourceLng}&ep=${latlng}&by=CAR`;
        }
      }
      break;
    case 'tmap':
      if (address) {
        url = `${prefixes.tmap}search?name=${address}`;
      } else {
        url = `${prefixes.tmap}viewmap?x=${lng}&y=${lat}`;

        if (useSourceDestiny) {
          url = `${prefixes.tmap}route?startx=${sourceLng}&starty=${sourceLat}&goalx=${lng}&goaly=${lat}`;
        }
      }
      break;
    case 'mapycz':
      if (address) {
        url = `${prefixes.mapycz}www.mapy.cz/zakladni?q=${address}`;
      } else {
        url = `${prefixes.mapycz}www.mapy.cz/zakladni?x=${lng}&y=${lat}&source=coor&id=${lng},${lat}`;
      }
      break;
    case 'maps-me':
      if (address) {
        url = `${prefixes['maps-me']}?q=${address}`;
      } else {
        url = `${prefixes['maps-me']}route?sll=${sourceLat},${sourceLng}&saddr= &dll=${lat},${lng}&daddr=${title}&type=vehicle`;
      }
      break;
    case 'osmand':
      if (address) {
        url = `${prefixes.osmand}show_map?addr=${address}`;
      } else {
        url = isIOS
          ? `${prefixes.osmand}?lat=${lat}&lon=${lng}`
          : `${prefixes.osmand}?q=${lat},${lng}`;
      }
      break;
    case 'gett':
      if (address) {
        throw new Error(
          'gett does not support passing the address or has not been implemented yet.',
        );
      } else {
        url = `${prefixes.gett}order?pickup=my_location&dropoff_latitude=${lat}&dropoff_longitude=${lng}`;
      }
      break;
    case 'navermap':
      if (address) {
        url = `${prefixes.navermap}search?query=${address}`;
      } else {
        url = `${prefixes.navermap}map?lat=${lat}&lng=${lng}&appname=${naverCallerName}`;

        if (useSourceDestiny) {
          url = `${prefixes.navermap}route?slat=${sourceLat}&slng=${sourceLng}&dlat=${lat}&dlng=${lng}&appname=${naverCallerName}`;
        }
      }
      break;
    case 'dgis':
      if (address) {
        url = `${prefixes.dgis}?q=${address}`;
      } else {
        url = `${prefixes.dgis}routeSearch/to/${lng},${lat}/go`;

        if (useSourceDestiny) {
          url = `${prefixes.dgis}routeSearch/to/${lng},${lat}/from/${sourceLng},${sourceLat}/go`;
        }
      }
      break;
    case 'liftago':
      if (address) {
        throw new Error(
          'liftago does not support passing the address or has not been implemented yet.',
        );
      } else {
        url = `${prefixes.liftago}order?destinationLat=${lat}&destinationLon=${lng}`;

        if (title) {
          url += `&destinationName=${encodedTitle}`;
        }

        if (useSourceDestiny) {
          url += `&pickupLat=${sourceLat}&pickupLon=${sourceLng}`;
        }
      }
      break;
    case 'petalmaps':
      if (address) {
        // Got this from this documentation https://developer.huawei.com/consumer/en/doc/HMSCore-Guides/petal-maps-introduction-0000001059189679
        url = `${prefixes.petalmaps}textSearch?text=${address}`;
      } else {
        url = `${prefixes.petalmaps}navigation?daddr=${lat},${lng}`;

        if (useSourceDestiny) {
          url += `&saddr=${sourceLat},${sourceLng}`;
        }
      }
      break;
    case 'sygic':
      const sygicDirectionsMode = getDirectionsModeSygic(directionsMode);
      if (address) {
        throw new Error(
          'sygic does not support passing the address or has not been implemented yet.',
        );
      } else {
        url = `${prefixes.sygic}coordinate|${lng}|${lat}|`;
      }
      url += sygicDirectionsMode ? `${sygicDirectionsMode}` : '';
      break;
  }

  return url;
};
