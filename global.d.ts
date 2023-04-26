declare namespace NodeJS {
    interface Process {
        browser: boolean
    }
}

declare interface String {
    toTitleCase(): string
}
