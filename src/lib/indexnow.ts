/**
 * Public IndexNow key. IndexNow keys are fetched from the site root, so this
 * is a committed constant, not an environment variable.
 * https://www.indexnow.org/documentation
 */
export const INDEXNOW_KEY = 'c9b5356d-2e1c-47f5-a97f-ecedab850b05'

export const INDEXNOW_HOST = 'www.edalkaup.is'

export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`
