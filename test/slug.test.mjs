import { expect } from 'chai';
import { toSlug, fromSlug } from '../dist/index.mjs';

describe('Helpers string', () => {
  it('convert string to slug', () => {
    const string = 'to_slug';
    const stringToSlug = 'to-slug';

    expect(toSlug(string)).to.be.equal(stringToSlug);
  });

  it('convert string to slug (multi slug)', () => {
    const string = 'to_slug_';
    const stringToSlug = 'to-slug-';
    const string2 = '_to_slug_';
    const stringToSlug2 = '-to-slug-';
    const string3 = '-to_slug_';
    const stringToSlug3 = '-to-slug-';

    expect(toSlug(string)).to.be.equal(stringToSlug);
    expect(toSlug(string2)).to.be.equal(stringToSlug2);
    expect(toSlug(string3)).to.be.equal(stringToSlug3);
  });

  it('convert string from slug', () => {
    const string = 'from-slug';
    const stringFromSlug = 'from_slug';

    expect(fromSlug(string)).to.be.equal(stringFromSlug);
  });

  it('convert string from slug (multi slug)', () => {
    const string = 'from-slug-';
    const stringFromSlug = 'from_slug_';
    const string2 = '-from-slug-';
    const stringFromSlug2 = '_from_slug_';
    const string3 = '_from-slug-';
    const stringFromSlug3 = '_from_slug_';

    expect(fromSlug(string)).to.be.equal(stringFromSlug);
    expect(fromSlug(string2)).to.be.equal(stringFromSlug2);
    expect(fromSlug(string3)).to.be.equal(stringFromSlug3);
  });
});
