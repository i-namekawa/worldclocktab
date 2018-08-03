// https://github.com/dj0001/Leaflet.Sun/blob/master/L.Sun.js modified by i-namekawa

function sun(Breite,Laenge,T,s,td)   //s=1=sunset; s=-1=sunrise;
// td: time difference float added by i-namekawa
{
//   var Breite = latlon.lat, Laenge = latlon.lng, T = new Date(), s = s||1
  var RAD = Math.PI / 180.0, h = -(50.0 / 60.0) * RAD, B = Breite * RAD;
  T = Math.ceil((T - new Date(T.getFullYear(), 0, 1)) / 86400000) //Tag im Jahr
  var DK = 0.4095 * Math.sin(0.016906 * (T - 80.086)) //sonnendeklination(T);
  var Untergang = 12 + s * (12.0 * Math.acos((Math.sin(h) - Math.sin(B) * Math.sin(DK)) / (Math.cos(B) * Math.cos(DK))) / Math.PI) -
    (-0.171 * Math.sin(0.0337 * T + 0.465) - 0.1299 * Math.sin(0.01787 * T - 0.168)) //12+(-)zeitdifferenz(DK) - zeitgleichung(T);
  Untergang = Untergang - Laenge / 15.0 + -new Date().getTimezoneOffset() / 60; //Zone
  Untergang = Math.floor(Untergang) % 24 + ":" + ("0" + Math.round(Untergang % 1 * 60)).slice(-2)
  return Untergang
}  
