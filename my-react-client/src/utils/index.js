export function getRedirectTo(type, header) {
  let path
  // type
  if(type==='laoban') {
    path = '/laoban'
  } else {
    path = '/dashen'
  }
  // header
  if(!header) { 
    path += 'info'
  }

  return path
}