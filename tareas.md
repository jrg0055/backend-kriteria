CORREGIR ERRORES 500:

Al hacer POST a /search desde el frontend, da error 500.
esto sale en la consola:
Request URL
https://backend-kriteria.jrg0055.workers.dev/search
Request Method
OPTIONS
Status Code
500 Internal Server Error
Remote Address
104.21.93.81:443
Referrer Policy
strict-origin-when-cross-origin
alt-svc
h3=":443"; ma=86400
cache-control
private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0
cf-ray
9c9d8c45ec34c9fc-MAD
content-length
4684
content-type
text/html; charset=UTF-8
date
Fri, 06 Feb 2026 20:55:21 GMT
expires
Thu, 01 Jan 1970 00:00:01 GMT
priority
u=1,i
referrer-policy
same-origin
server
cloudflare
server-timing
cfExtPri
x-frame-options
SAMEORIGIN
:authority
backend-kriteria.jrg0055.workers.dev
:method
OPTIONS
:path
/search
:scheme
https
accept
*/*
accept-encoding
gzip, deflate, br, zstd
accept-language
es-ES,es;q=0.9
access-control-request-headers
content-type
access-control-request-method
POST
origin
https://kriteria.pages.dev
priority
u=1, i
referer
https://kriteria.pages.dev/
sec-fetch-dest
empty
sec-fetch-mode
cors
sec-fetch-site
cross-site
user-agent
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36







y tambien sale:
Request URL
https://backend-kriteria.jrg0055.workers.dev/
Request Method
GET
Status Code
500 Internal Server Error
Referrer Policy
strict-origin-when-cross-origin
alt-svc
h3=":443"; ma=86400
cache-control
private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0
cf-ray
9c9d8bdcb8b6c9fc-MAD
content-length
4684
content-type
text/html; charset=UTF-8
date
Fri, 06 Feb 2026 20:55:04 GMT
expires
Thu, 01 Jan 1970 00:00:01 GMT
priority
u=1,i
referrer-policy
same-origin
server
cloudflare
server-timing
cfExtPri
x-frame-options
SAMEORIGIN
:authority
backend-kriteria.jrg0055.workers.dev
:method
GET
:path
/
:scheme
https
accept
*/*
accept-encoding
gzip, deflate, br, zstd
accept-language
es-ES,es;q=0.9
origin
https://kriteria.pages.dev
priority
u=1, i
referer
https://kriteria.pages.dev/
sec-ch-ua
"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"
sec-ch-ua-mobile
?0
sec-ch-ua-platform
"Windows"
sec-fetch-dest
empty
sec-fetch-mode
cors
sec-fetch-site
cross-site
user-agent
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36






y tambien a veces esta bien:
Request URL
https://backend-kriteria.jrg0055.workers.dev/
Request Method
GET
Status Code
304 Not Modified
Remote Address
188.114.96.5:443
Referrer Policy
strict-origin-when-cross-origin
access-control-allow-credentials
true
access-control-allow-headers
Content-Type, Authorization
access-control-allow-methods
GET, POST, PUT, DELETE, OPTIONS
access-control-allow-origin
https://kriteria.pages.dev
alt-svc
h3=":443"; ma=86400
cf-ray
9c9da061ace6d862-MAD
date
Fri, 06 Feb 2026 21:09:05 GMT
etag
W/"30-qhysxF1TkNvkNV1DKFb61CyrnQA"
nel
{"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
report-to
{"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=JM5fh6iKavv%2BseyxlXKHHKXGkQP2qJbUrRPKx2b634%2FzD1yvHBoAJogcl1p8G5YRTsSk0LxLPb5EEQzc2nz1aWHblLIBIA7icQBVlPQO0bLkKhgge3G5E6UFcus3fIDpS2Wdtg%3D%3D"}]}
server
cloudflare
vary
Origin
x-powered-by
Express
:authority
backend-kriteria.jrg0055.workers.dev
:method
GET
:path
/
:scheme
https
accept
*/*
accept-encoding
gzip, deflate, br, zstd
accept-language
es-ES,es;q=0.9
if-none-match
W/"30-qhysxF1TkNvkNV1DKFb61CyrnQA"
origin
https://kriteria.pages.dev
priority
u=1, i
referer
https://kriteria.pages.dev/
sec-ch-ua
"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"
sec-ch-ua-mobile
?0
sec-ch-ua-platform
"Windows"
sec-fetch-dest
empty
sec-fetch-mode
cors
sec-fetch-site
cross-site
user-agent
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36