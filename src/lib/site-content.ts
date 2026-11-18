import { reader } from './reader'

// Thin wrappers so components share one way to read each singleton. Each can resolve to null
// when the content file is missing; callers render what they have instead of throwing.
export const getProfile = () => reader.singletons.profile.read()
export const getHero = () => reader.singletons.hero.read()
export const getAbout = () => reader.singletons.about.read()
export const getContact = () => reader.singletons.contact.read()
export const getCv = () => reader.singletons.cv.read()
