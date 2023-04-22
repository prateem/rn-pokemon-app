import {AppRoute} from "./AppRouter";
import {HomeTab} from "../views/screens/main/Home";
import * as Linking from 'expo-linking';

export type ScreenDeepLink<RouteName extends keyof AppRoute> = {
    route: RouteName,
    params: AppRoute[RouteName]
}

export type TabDeepLink<TabName extends keyof HomeTab> = {
    tab: TabName
}

/**
 * Processes deep links in the format of:
 *     `app://tab[/section/param]`
 * where `[/section/param]` (pairing required) is optional (and repeatable).
 *
 * @example Pikachu
 * `app://pokemon/pokemon/25`
 *
 * @example Youngster Joey's Ratata
 * `app://trainers/trainer/1/pokemon/19`
 *
 * @example Swimmer Briana's Seaking from Misty's gym
 * `app://gyms/gym/10/trainer/10005/pokemon/119`
 */
export function processDeepLink(url: string): Array<any> {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
        `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
            queryParams
        )}`
    );

    return []

    const components = url.pathname
        .replace(/^\/+|\/+$/g, '')
        .split('/')

    const results: any[] = []
    if (components.length >= 1) {
        const tab = components[0]
        if (tab as keyof HomeTab) {
            results.push({ tab })
        }

        const path = components.slice(1, components.length)
        const processed = processPath(path.join('/'))
        results.push(...processed)
    }

    return results
}

/**
 * Processes screen path in the format of:
 *     `[/section/param]` pairings
 * where the pairing is required (and repeatable).
 *
 * @example Pikachu
 * `/pokemon/25`
 *
 * @example Youngster Joey's Ratata
 * `/trainer/1/pokemon/19`
 *
 * @example Swimmer Briana's Seaking from Misty's gym
 * `/gym/10/trainer/10005/pokemon/119`
 */
export function processPath(path: string): Array<ScreenDeepLink<any>> {
    const components = path
        .replace(/^\/+|\/+$/g, '')
        .split('/')

    const results: ScreenDeepLink<any>[] = []
    if (components.length >= 2) {
        let idx = 0

        // each nested screen needs a corresponding parameter
        while (components.length > idx + 1) {
            const screen = components[idx]
            const param = components[idx+1]

            try {
                if (screen as keyof AppRoute) {
                    const r = screen as keyof AppRoute
                    if (r == 'pokemon') {
                        const params: AppRoute['pokemon'] = {number: parseInt(param)}
                        results.push({route: screen, params})
                    } else if (r == 'trainer') {
                        const params: AppRoute['trainer'] = {id: parseInt(param)}
                        results.push({route: screen, params})
                    } else if (r == 'gym') {
                        const params: AppRoute['gym'] = {number: parseInt(param)}
                        results.push({route: screen, params})
                    }
                }
            } catch (e) {
                // eat it gracefully
            }

            idx += 2
        }
    }

    return results
}


export function isScreenDeepLink(link: any): link is ScreenDeepLink<keyof AppRoute> {
    if ('route' in link && 'params' in link) {
        const route = link['route']
        return route satisfies keyof AppRoute
    }

    return false
}

export function isTabDeepLink(link: any): link is TabDeepLink<keyof HomeTab> {
    if ('tab' in link) {
        const tab = link['tab']
        return tab satisfies keyof HomeTab
    }

    return false
}