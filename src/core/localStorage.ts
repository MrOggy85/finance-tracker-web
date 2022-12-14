type Key = 'U' | 'PW' | 'H' | 'PORT' | 'DB';

export function save(key: Key, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function load(key: Key): string {
  try {
    return window.localStorage.getItem(key) || '';
  } catch (error) {
    console.error(error);
    return '';
  }
}
