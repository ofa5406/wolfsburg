// One place that knows where everything is.
//
// The submission folder is pure output: whatever sits in it is exactly what
// gets uploaded to Nextcloud, because the studio's folder there is fixed and we
// are told not to create new entries in it. So the tooling lives here, outside
// the package, and every script resolves its paths through this module rather
// than from its own location.

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/** This folder — the working tooling, tracked in git. */
export const TOOLS = dirname(fileURLToPath(import.meta.url))

/** The wolfsburg project root. */
export const PROJECT = join(TOOLS, '..')

/** The submission package. Everything below is uploaded as-is. */
export const SUBMISSION = join(PROJECT, 'final submission')

export const SITE = join(SUBMISSION, 'site')
export const SOURCE = join(SUBMISSION, 'source')
export const MATERIALS = join(SUBMISSION, 'materials')
export const EXHIBITION = join(SUBMISSION, 'exhibition')
export const RAW = join(SUBMISSION, 'raw')

/** The six entries the Nextcloud folder is allowed to contain. */
export const UPLOAD_SHAPE = ['site', 'source', 'materials', 'exhibition', 'raw', 'README.md']

/** Tooling assets that get copied into the package. */
export const LAUNCHERS = join(TOOLS, 'launchers')
export const MATERIALS_WEB = join(TOOLS, 'materials-web')
export const MAP_README = join(TOOLS, 'map-README.md')
export const SUBMISSION_README = join(TOOLS, 'README-submission.md')
export const IMAGE_CREDITS = join(TOOLS, 'image-credits.xlsx')
