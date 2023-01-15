export function expecting(value: boolean, message?: string): void {
  if ( !value )
    throw message ? message : "";
}