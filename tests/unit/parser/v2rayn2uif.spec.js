import V2rayN2UIF from '@/store/uif/v2rayn2uif.js'
import {
  Base64
} from 'js-base64';

var temp = 'dHJvamFuOi8vYzY4ZTNjMjAtZGE3My00NzkxLWI0ZDgtNzAxMWE5OGJhMDZiQGtiYXdzc2cxLmFpb3Blbi5jZmQ6NDQzP3BlZXI9NC0xOTMtMTA1LTE0MS5uaG9zdC4wMGNkbi5jb20mdGZvPTEjJUU3JUJFJThFJUU1JTlCJUJEKyVFOSVCQSVCQiVFNyU5QyU4MSVFNyU5MCU4NiVFNSVCNyVBNSVFNSVBRCVBNiVFOSU5OSVBMgpzczovL1lXVnpMVEkxTmkxblkyMDZZMlJDU1VSV05ESkVRM2R1WmtsT0AzOC4xMjEuNDMuNzE6ODExOSMlRTclQkUlOEUlRTUlOUIlQkQrJUU1JThEJThFJUU3JTlCJTlCJUU5JUExJUJGQ29nZW50JUU5JTgwJTlBJUU0JUJGJUExJUU1JTg1JUFDJUU1JThGJUI4CnZtZXNzOi8vZXlKMklqb2dJaklpTENBaWNITWlPaUFpWEhVM1pqaGxYSFUxTm1aa0lGWXlRMUpQVTFNdVEwOU5JaXdnSW1Ga1pDSTZJQ0l4TURndU1UZzJMakU1TWk0eU16QWlMQ0FpY0c5eWRDSTZJQ0kwTlRVd01pSXNJQ0owZVhCbElqb2dJbTV2Ym1VaUxDQWlhV1FpT2lBaU5ERTRNRFE0WVdZdFlUSTVNeTAwWWprNUxUbGlNR010T1RoallUTTFPREJrWkRJMElpd2dJbUZwWkNJNklDSTJOQ0lzSUNKdVpYUWlPaUFpZEdOd0lpd2dJbkJoZEdnaU9pQWlMM0JoZEdndk1UWTRPVEUxTnpBNE1UZzFPQ0lzSUNKb2IzTjBJam9nSWlJc0lDSjBiSE1pT2lBaUluMD0Kdm1lc3M6Ly9leUpoWkdRaU9pQWlhbkF1Yld4NFp5NXZjbWNpTENBaWRpSTZJQ0l5SWl3Z0luQnpJam9nSWx4MU4yWTRaVngxTlRabVpDQkRiRzkxWkVac1lYSmxYSFU0TWpneVhIVTNNR0k1SWl3Z0luQnZjblFpT2lBNE1Dd2dJbWxrSWpvZ0ltTTNORFF5T0RVeUxUVmhORGd0TkRRMU5pMDROemd6TFdJM1lqaGxaV0ppWTJFMll5SXNJQ0poYVdRaU9pQWlNQ0lzSUNKdVpYUWlPaUFpZDNNaUxDQWlkSGx3WlNJNklDSWlMQ0FpYUc5emRDSTZJQ0pxY0RJdWJXeDRaeTV2Y21jaUxDQWljR0YwYUNJNklDSXZJaXdnSW5Sc2N5STZJQ0lpZlE9PQp2bWVzczovL2V5SmhaR1FpT2lBaU1UVTJMakl5TlM0Mk55NHhNRE1pTENBaWRpSTZJQ0l5SWl3Z0luQnpJam9nSWx4MU5UTTFOMXgxT1RjMVpTQldNa05TVDFOVExrTlBUU0lzSUNKd2IzSjBJam9nTkRjM09USXNJQ0pwWkNJNklDSTBNVGd3TkRoaFppMWhNamt6TFRSaU9Ua3RPV0l3WXkwNU9HTmhNelU0TUdSa01qUWlMQ0FpWVdsa0lqb2dJalkwSWl3Z0ltNWxkQ0k2SUNKMFkzQWlMQ0FpZEhsd1pTSTZJQ0lpTENBaWFHOXpkQ0k2SUNJaUxDQWljR0YwYUNJNklDSXZJaXdnSW5Sc2N5STZJQ0lpZlE9PQp2bWVzczovL2V5SjJJam9nSWpJaUxDQWljSE1pT2lBaVhIVTNaamhsWEhVMU5tWmtJRU5zYjNWa1JteGhjbVZjZFRneU9ESmNkVGN3WWpraUxDQWlZV1JrSWpvZ0luZDNkeTV1YjJsalpTNXBaQ0lzSUNKd2IzSjBJam9nSWpRME15SXNJQ0pwWkNJNklDSTNPREUyTXpnMFppMDFaRFUyTFRSaU1URXRPRFEwTmkxbFlqbGlNVE13Tm1KbVpEVWlMQ0FpWVdsa0lqb2dJakFpTENBaWMyTjVJam9nSW1GMWRHOGlMQ0FpYm1WMElqb2dJbmR6SWl3Z0luUjVjR1VpT2lBaWJtOXVaU0lzSUNKb2IzTjBJam9nSW5ObmJYZHpMbTFoYVc1emMyZ3VlSGw2SWl3Z0luQmhkR2dpT2lBaUwzWnRaWE56SWl3Z0luUnNjeUk2SUNKMGJITWlMQ0FpYzI1cElqb2dJaUo5CnRyb2phbjovL2M2OGUzYzIwLWRhNzMtNDc5MS1iNGQ4LTcwMTFhOThiYTA2YkBrYmF3c3NnMi5haW9wZW4uY2ZkOjQ0Mz9wZWVyPTQtMTkzLTEwNS0xNDEubmhvc3QuMDBjZG4uY29tJnRmbz0xIyVFNiU5NiVCMCVFNSU4QSVBMCVFNSU5RCVBMStBbWF6b24lRTYlOTUlQjAlRTYlOEQlQUUlRTQlQjglQUQlRTUlQkYlODMKdm1lc3M6Ly9leUoySWpvZ0lqSWlMQ0FpY0hNaU9pQWlYSFUzWmpobFhIVTFObVprSUVOc2IzVmtSbXhoY21WY2RUZ3lPREpjZFRjd1lqa2lMQ0FpWVdSa0lqb2dJbU5tTFd4MExuTm9ZWEpsWTJWdWRISmxMbTl1YkdsdVpTSXNJQ0p3YjNKMElqb2dJamd3T0RBaUxDQWlhV1FpT2lBaVpHUTROMlF6TmpJdFpHSmhNUzAwT1dGaExUbGpOek10T0Rkak9ESTRaak0zTW1RMklpd2dJbUZwWkNJNklDSXdJaXdnSW5OamVTSTZJQ0poZFhSdklpd2dJbTVsZENJNklDSjNjeUlzSUNKMGVYQmxJam9nSW01dmJtVWlMQ0FpYUc5emRDSTZJQ0p6YzNKemRXSXVkakF6TG5OemNuTjFZaTVqYjIwaUxDQWljR0YwYUNJNklDSXZZWEJwTDNZekwyUnZkMjVzYjJGa0xtZGxkRVpwYkdVaUxDQWlkR3h6SWpvZ0lpSXNJQ0p6Ym1raU9pQWlJaXdnSW1Gc2NHNGlPaUFpSW4wPQp2bWVzczovL2V5SmhaR1FpT2lBaU1UQTRMakU0Tmk0eE9USXVNak16SWl3Z0luWWlPaUFpTWlJc0lDSndjeUk2SUNKY2RUZG1PR1ZjZFRVMlptUWdWakpEVWs5VFV5NURUMDBpTENBaWNHOXlkQ0k2SURRMU5UQXlMQ0FpYVdRaU9pQWlOREU0TURRNFlXWXRZVEk1TXkwMFlqazVMVGxpTUdNdE9UaGpZVE0xT0RCa1pESTBJaXdnSW1GcFpDSTZJQ0kyTkNJc0lDSnVaWFFpT2lBaWRHTndJaXdnSW5SNWNHVWlPaUFpSWl3Z0ltaHZjM1FpT2lBaUlpd2dJbkJoZEdnaU9pQWlMeUlzSUNKMGJITWlPaUFpSW4wPQp2bWVzczovL2V5SjJJam9nSWpJaUxDQWljSE1pT2lBaVhIVTNaamhsWEhVMU5tWmtJRU5zYjNWa1JteGhjbVZjZFRVeE5tTmNkVFV6WmpoRFJFNWNkVGd5T0RKY2RUY3dZamtvYzJodmNHbG1lU2tpTENBaVlXUmtJam9nSW1SdmJtZDBZV2wzWVc1bk15NWpiMjBpTENBaWNHOXlkQ0k2SUNJME5ETWlMQ0FpYVdRaU9pQWlObVJsWkdSaU4yWXRaVFUxTnkwME1tUmlMV0ptWVRBdFkyWTBNR0l6Tm1JeU4yVXlJaXdnSW1GcFpDSTZJQ0l3SWl3Z0luTmplU0k2SUNKaGRYUnZJaXdnSW01bGRDSTZJQ0ozY3lJc0lDSjBlWEJsSWpvZ0ltNXZibVVpTENBaWFHOXpkQ0k2SUNKa0xtWnlaV1ZvTVM1NGVYb2lMQ0FpY0dGMGFDSTZJQ0l2Wkc5dVozUmhhWGRoYm1jdVkyOXRJaXdnSW5Sc2N5STZJQ0owYkhNaUxDQWljMjVwSWpvZ0lpSjkKdm1lc3M6Ly9leUpoWkdRaU9pQWlNVFUyTGpJME9TNHhPQzR4TWpjaUxDQWlkaUk2SUNJeUlpd2dJbkJ6SWpvZ0lseDFOVE0xTjF4MU9UYzFaVngxT0dNMllWeDFOelkzWWx4MU56Y3dNVngxTjJWaE5seDFOMlptTUZ4MU5URTROVngxTmpWaFpseDFOVGd5TVNCRGJHOTFaR2x1Ym05MllYUnBiMjVjZFRZMU56QmNkVFl6Tm1WY2RUUmxNbVJjZFRWbVl6TWlMQ0FpY0c5eWRDSTZJRFE0TVRBd0xDQWlhV1FpT2lBaU1URXhNVGRrTkdNdE0ySTJZUzAwWlRjMkxUaGlZMk10TW1JME1XSXpaVGxqWVRreklpd2dJbUZwWkNJNklDSTJOQ0lzSUNKdVpYUWlPaUFpZEdOd0lpd2dJblI1Y0dVaU9pQWlJaXdnSW1odmMzUWlPaUFpSWl3Z0luQmhkR2dpT2lBaUx5SXNJQ0owYkhNaU9pQWlJbjA9'

// rawData = 'dm1lc3M6Ly9leUoySWpvZ0lqSWlMQ0FpY0hNaU9pQWlYSFUyWm1JelhIVTFPVEkzWEhVMU1qSTVYSFUwWlRsaElGeDFOakE0T1Z4MU5XTXpZeUlzSUNKaFpHUWlPaUFpTWpBekxqSXpMakV3TkM0eE9UQWlMQ0FpY0c5eWRDSTZJQ0kwTkRNaUxDQWlhV1FpT2lBaU5EazFSa0ZHT1VVdE9UYzNOUzAwUkVNMUxUa3hSakF0UXpRek5ERkNOemc1UWpSR0lpd2dJbUZwWkNJNklDSXdJaXdnSW5OamVTSTZJQ0poZFhSdklpd2dJbTVsZENJNklDSjNjeUlzSUNKMGVYQmxJam9nSW01dmJtVWlMQ0FpYUc5emRDSTZJQ0pFZFhOelpXeGtiM0ptTG10dmRHbGpheTV6YVhSbElpd2dJbkJoZEdnaU9pQWlMM053WldWa2RHVnpkQ0lzSUNKMGJITWlPaUFpZEd4eklpd2dJbk51YVNJNklDSWlMQ0FpWVd4d2JpSTZJQ0lpZlE9PQp2bWVzczovL2V5SmhaR1FpT2lBaU5qUXVNekl1TWpBdU1UQXhJaXdnSW5ZaU9pQWlNaUlzSUNKd2N5STZJQ0pjZFRkbU9HVmNkVFUyWm1RZ1hIVTFNbUV3WEhVMU1qSTVYSFUzT1RobVhIVTFZek5qWEhVMFpUbGhYSFUxWkdSbFhIVTJaREZpWEhVMk56UTVYSFUzTjJZMlUyaGhjbXQwWldOb1hIVTJOVGN3WEhVMk16WmxYSFUwWlRKa1hIVTFabU16SWl3Z0luQnZjblFpT2lBME1EQXpPU3dnSW1sa0lqb2dJbU14WW1Ga09XRTJMVEUwT0RJdE5EazBNUzFoTUdNMExXVTROV1l6WTJKaVkySTFZU0lzSUNKaGFXUWlPaUFpTmpRaUxDQWlibVYwSWpvZ0luUmpjQ0lzSUNKMGVYQmxJam9nSWlJc0lDSm9iM04wSWpvZ0lpSXNJQ0p3WVhSb0lqb2dJaThpTENBaWRHeHpJam9nSWlKOQp2bWVzczovL2V5SmhaR1FpT2lBaU1UUXdMams1TGpVNUxqSXpNQ0lzSUNKMklqb2dJaklpTENBaWNITWlPaUFpWEhVM1pqaGxYSFUxTm1aa0lFUmhkR0ZpYVd4cGRIa2lMQ0FpY0c5eWRDSTZJRFUxTlRFeUxDQWlhV1FpT2lBaU5ERTRNRFE0WVdZdFlUSTVNeTAwWWprNUxUbGlNR010T1RoallUTTFPREJrWkRJMElpd2dJbUZwWkNJNklDSTJOQ0lzSUNKdVpYUWlPaUFpZEdOd0lpd2dJblI1Y0dVaU9pQWlJaXdnSW1odmMzUWlPaUFpSWl3Z0luQmhkR2dpT2lBaUx5SXNJQ0owYkhNaU9pQWlJbjA9CnZtZXNzOi8vZXlKaFpHUWlPaUFpTVRBNExqRTROaTR4TVRZdU1UZ3pJaXdnSW5ZaU9pQWlNaUlzSUNKd2N5STZJQ0pjZFRkbU9HVmNkVFUyWm1RZ1ZqSkRVazlUVXk1RFQwMGlMQ0FpY0c5eWRDSTZJRFUxTURBMUxDQWlhV1FpT2lBaU5ERTRNRFE0WVdZdFlUSTVNeTAwWWprNUxUbGlNR010T1RoallUTTFPREJrWkRJMElpd2dJbUZwWkNJNklDSTJOQ0lzSUNKdVpYUWlPaUFpZEdOd0lpd2dJblI1Y0dVaU9pQWlJaXdnSW1odmMzUWlPaUFpSWl3Z0luQmhkR2dpT2lBaUx5SXNJQ0owYkhNaU9pQWlJbjA9CnZtZXNzOi8vZXlKMklqb2dJaklpTENBaWNITWlPaUFpWEhVM1pqaGxYSFUxTm1aa0lFTnNiM1ZrUm14aGNtVmNkVGd5T0RKY2RUY3dZamtpTENBaVlXUmtJam9nSWpFd05DNHlNQzR4T0M0MU5DSXNJQ0p3YjNKMElqb2dJakl3T1RVaUxDQWlhV1FpT2lBaU9HTTBaVFZsT0RNdE9HSmxNaTAwTmpNNExXVXpaall0WVRBNU9HVmxORGcwTVRreklpd2dJbUZwWkNJNklDSXdJaXdnSW5OamVTSTZJQ0poZFhSdklpd2dJbTVsZENJNklDSjNjeUlzSUNKMGVYQmxJam9nSW01dmJtVWlMQ0FpYUc5emRDSTZJQ0pvYXk1M2VXaHJZV0V3TG5Scklpd2dJbkJoZEdnaU9pQWlMMEJvYTJGaE1DSXNJQ0owYkhNaU9pQWlJaXdnSW5OdWFTSTZJQ0lpTENBaVlXeHdiaUk2SUNJaWZRPT0Kdm1lc3M6Ly9leUpoWkdRaU9pQWlOalF1TXpJdU5DNHpOQ0lzSUNKMklqb2dJaklpTENBaWNITWlPaUFpWEhVM1pqaGxYSFUxTm1aa0lGeDFOVEpoTUZ4MU5USXlPVngxTnprNFpseDFOV016WTF4MU5HVTVZVngxTldSa1pWeDFObVF4WWx4MU5qYzBPVngxTnpkbU5sTm9ZWEpyZEdWamFGeDFOalUzTUZ4MU5qTTJaVngxTkdVeVpGeDFOV1pqTXlJc0lDSndiM0owSWpvZ05ETXhOallzSUNKcFpDSTZJQ0k0TmpVek1EQTBaaTFrWlRZM0xUUTBZekl0T1dOalpTMWxNRGd6TURrek0yWmlNRE1pTENBaVlXbGtJam9nSWpZMElpd2dJbTVsZENJNklDSjBZM0FpTENBaWRIbHdaU0k2SUNJaUxDQWlhRzl6ZENJNklDSWlMQ0FpY0dGMGFDSTZJQ0l2SWl3Z0luUnNjeUk2SUNJaWZRPT0Kdm1lc3M6Ly9leUoySWpvZ0lqSWlMQ0FpY0hNaU9pQWlYSFUzWmpobFhIVTFObVprSUVOc2IzVmtSbXhoY21WY2RUZ3lPREpjZFRjd1lqa2lMQ0FpWVdSa0lqb2dJbU5tTFd4MExuTm9ZWEpsWTJWdWRISmxMbTl1YkdsdVpTSXNJQ0p3YjNKMElqb2dJamd3SWl3Z0ltbGtJam9nSWpWbU56VXhZelpsTFRVd1lqRXRORGM1TnkxaVlUaGxMVFptWm1Vek1qUmhNR0pqWlNJc0lDSmhhV1FpT2lBaU1DSXNJQ0p6WTNraU9pQWlZWFYwYnlJc0lDSnVaWFFpT2lBaWQzTWlMQ0FpZEhsd1pTSTZJQ0p1YjI1bElpd2dJbWh2YzNRaU9pQWlaSEF6TG5OamNISnZlSGt1ZEc5d0lpd2dJbkJoZEdnaU9pQWlMM05vYVhKclpYSWlMQ0FpZEd4eklqb2dJaUlzSUNKemJta2lPaUFpSWl3Z0ltRnNjRzRpT2lBaUluMD0Kdm1lc3M6Ly9leUoySWpvZ0lqSWlMQ0FpY0hNaU9pQWlYSFUzWmpobFhIVTFObVprSUZZeVExSlBVMU11UTA5Tklpd2dJbUZrWkNJNklDSnVjekV1ZGpJdGRtbHdMbVoxYmlJc0lDSndiM0owSWpvZ0lqZ3dJaXdnSW1sa0lqb2dJamhoWW1VNU5EazJMVFZsTWpRdE5HVTBPUzFpTlRZMkxXUmpaamcyTVRFMk1ERTNaQ0lzSUNKaGFXUWlPaUFpTUNJc0lDSnpZM2tpT2lBaVlYVjBieUlzSUNKdVpYUWlPaUFpZDNNaUxDQWlkSGx3WlNJNklDSnViMjVsSWl3Z0ltaHZjM1FpT2lBaVpHVTFMbWx5ZEdWb0xtWjFiaUlzSUNKd1lYUm9Jam9nSWk5cE9UbE1aM1pUWVhOc1luTlFURXhSVVRkcU5sb2lMQ0FpZEd4eklqb2dJaUlzSUNKemJta2lPaUFpSWl3Z0ltRnNjRzRpT2lBaUluMD0Kdm1lc3M6Ly9leUoySWpvZ0lqSWlMQ0FpY0hNaU9pQWlYSFUzWmpobFhIVTFObVprSUVOc2IzVmtSbXhoY21WY2RUZ3lPREpjZFRjd1lqa2lMQ0FpWVdSa0lqb2dJbVZrZFRFdWRpMXdiaTV0ZVM1cFpDSXNJQ0p3YjNKMElqb2dJalEwTXlJc0lDSnBaQ0k2SUNJNU9EUTNObU15WmkweU9UY3hMVFF6TWpZdE9UTmpOQzA0T1RaaE9EVXhNalE0TkRVaUxDQWlZV2xrSWpvZ0lqQWlMQ0FpYzJONUlqb2dJbUYxZEc4aUxDQWlibVYwSWpvZ0luZHpJaXdnSW5SNWNHVWlPaUFpYm05dVpTSXNJQ0pvYjNOMElqb2dJbWxyWkRJdWRuQnVMV0ZyWTJWc2JIVnNaWEl1YlhrdWFXUWlMQ0FpY0dGMGFDSTZJQ0l2ZGpKeVlYa2lMQ0FpZEd4eklqb2dJblJzY3lJc0lDSnpibWtpT2lBaWFXdGtNaTUyY0c0dFlXdGpaV3hzZFd4bGNpNXRlUzVwWkNJc0lDSmhiSEJ1SWpvZ0lpSjkKdm1lc3M6Ly9leUpoWkdRaU9pQWlORFV1TVRrNUxqRXpPQzR4TmpZaUxDQWlkaUk2SUNJeUlpd2dJbkJ6SWpvZ0lseDFOMlk0WlZ4MU5UWm1aQ0JjZFRVeVlUQmNkVFV5TWpsY2RUYzVPR1pjZFRWak0yTmNkVFJsT1dGY2RUVmtaR1ZjZFRVM01qTmNkVFJtTlRWY2RUVTROV1ZOVlV4VVFVTlBUVngxTmpjellWeDFOakl6WmlJc0lDSndiM0owSWpvZ05UVXdNVFlzSUNKcFpDSTZJQ0kwTVRnd05EaGhaaTFoTWprekxUUmlPVGt0T1dJd1l5MDVPR05oTXpVNE1HUmtNalFpTENBaVlXbGtJam9nSWpZMElpd2dJbTVsZENJNklDSjBZM0FpTENBaWRIbHdaU0k2SUNJaUxDQWlhRzl6ZENJNklDSnViQzV6YUdGeVpXTmxiblJ5WlhCeWJ5NWpiMjBpTENBaWNHRjBhQ0k2SUNJdmMyaHBjbXRsY2lJc0lDSjBiSE1pT2lBaUluMD0Kdm1lc3M6Ly9leUpoWkdRaU9pQWlkWE11Yld4NFp5NXZjbWNpTENBaVlXbGtJam9nTUN3Z0ltaHZjM1FpT2lBaWRYTXhMbTFzZUdjdWIzSm5JaXdnSW1sa0lqb2dJbU0zTkRReU9EVXlMVFZoTkRndE5EUTFOaTA0TnpnekxXSTNZamhsWldKaVkyRTJZeUlzSUNKdVpYUWlPaUFpZDNNaUxDQWljR0YwYUNJNklDSXZJaXdnSW5CdmNuUWlPaUE0TUN3Z0luQnpJam9nSWx4MU4yWTRaVngxTlRabVpDQkRiRzkxWkVac1lYSmxYSFU0TWpneVhIVTNNR0k1SWl3Z0luUnNjeUk2SUNJaUxDQWlkSGx3WlNJNklDSmhkWFJ2SWl3Z0luTmxZM1Z5YVhSNUlqb2dJbUYxZEc4aUxDQWljMnRwY0MxalpYSjBMWFpsY21sbWVTSTZJSFJ5ZFdVc0lDSnpibWtpT2lBaUluMD0Kdm1lc3M6Ly9leUoySWpvZ0lqSWlMQ0FpY0hNaU9pQWlYSFUzWmpobFhIVTFObVprSUZZeVExSlBVMU11UTA5Tklpd2dJbUZrWkNJNklDSXhNRFF1TXpFdU1UWXVORFlpTENBaWNHOXlkQ0k2SUNJeU1EZ3lJaXdnSW1sa0lqb2dJalU0Wm1VeE5UUXlMVFV5T1RBdE5EQmhaQzA0TVRWaExUYzNOekEzWVRneFlXWmxOU0lzSUNKaGFXUWlPaUFpTUNJc0lDSnpZM2tpT2lBaVlYVjBieUlzSUNKdVpYUWlPaUFpZDNNaUxDQWlkSGx3WlNJNklDSnViMjVsSWl3Z0ltaHZjM1FpT2lBaVkyRTFMblJsYUcxbE1UQXdMbVoxYmlJc0lDSndZWFJvSWpvZ0lpOUpUMlZpYUV4TmFHd3hRMVJpUmtoaVREazFiWGxtVWxneUlpd2dJblJzY3lJNklDSWlMQ0FpYzI1cElqb2dJaUlzSUNKaGJIQnVJam9nSWlKOQp2bWVzczovL2V5SjJJam9nSWpJaUxDQWljSE1pT2lBaVhIVTNaamhsWEhVMU5tWmtJRU5zYjNWa1JteGhjbVZjZFRneU9ESmNkVGN3WWpraUxDQWlZV1JrSWpvZ0ltVmtkVEV1WVdzdFkyVnNiSFZzWlhJdVkyOXRJaXdnSW5CdmNuUWlPaUFpTkRReklpd2dJbWxrSWpvZ0lqWXhZVEZpTlRCaExUa3dPRFV0TkRNNE5TMDROREJrTFRFd1lqSXpZalprWVROaU1DSXNJQ0poYVdRaU9pQWlNQ0lzSUNKelkza2lPaUFpWVhWMGJ5SXNJQ0p1WlhRaU9pQWlkM01pTENBaWRIbHdaU0k2SUNKdWIyNWxJaXdnSW1odmMzUWlPaUFpYlhOaE1TNWhheTFqWld4c2RXeGxjaTVqYjIwaUxDQWljR0YwYUNJNklDSXZkakp5WVhraUxDQWlkR3h6SWpvZ0luUnNjeUlzSUNKemJta2lPaUFpYlhOaE1TNWhheTFqWld4c2RXeGxjaTVqYjIwaUxDQWlZV3h3YmlJNklDSWlmUT09'

describe('parser:parse to uif config', () => {
  it('trojan with ws', () => {
    var rawData = Base64.encode('trojan://f@uck.me/?sni=microsoft.com&type=ws&path=%2Fgo&encryption=ss%3Baes-256-gcm%3Afuckgfw&host=uif.org#abcdd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcdd')
    expect(res['protocol']).toBe('trojan')
    expect(res['setting']['password']).toBe('f')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['address']).toBe('uck.me')
    expect(transport['port']).toBe(443)
    expect(transport['protocol']).toBe('ws')

    expect(transport['setting']['path']).toBe('/go')
    expect(transport['setting']['headers']['Host']).toBe('uif.org')
  });

  it('trojan normal', () => {
    var rawData = Base64.encode('trojan://password@address:80/?#abcdd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcdd')
    expect(res['protocol']).toBe('trojan')
    expect(res['setting']['password']).toBe('password')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['address']).toBe('address')
    expect(transport['port']).toBe(80)
    expect(transport['protocol']).toBe('tcp')
  });

  it('trojan normal', () => {
    var rawData = Base64.encode('trojan://password@address/?#abcdd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcdd')
    expect(res['protocol']).toBe('trojan')
    expect(res['setting']['password']).toBe('password')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['address']).toBe('address')
    expect(transport['port']).toBe(443)
    expect(transport['protocol']).toBe('tcp')
  });

  it('trojan ip ws host', () => {
    var rawData = Base64.encode('trojan://password@127.0.0.1:800/?&type=ws&path=%2Fgoole&host=abc.com#abcdd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcdd')
    expect(res['protocol']).toBe('trojan')
    expect(res['setting']['password']).toBe('password')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['address']).toBe('127.0.0.1')
    expect(transport['port']).toBe(800)
    expect(transport['protocol']).toBe('ws')

    expect(transport['setting']['path']).toBe('/goole')
    expect(transport['setting']['headers']['Host']).toBe('abc.com')
  });

  it('ss ip', () => {
    var rawData = Base64.encode('ss://YWVzLTI1Ni1nY206Y2RCSURWNDJEQ3duZklO@8.21.3.1:8119#abcd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcd')
    expect(res['protocol']).toBe('shadowsocks')
    expect(res['setting']['password']).toBe('cdBIDV42DCwnfIN')
    expect(res['setting']['method']).toBe('aes-256-gcm')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('none')
    expect(transport['address']).toBe('8.21.3.1')
    expect(transport['port']).toBe(8119)
    expect(transport['protocol']).toBe('tcp')
  });

  it('vmess ws', () => {
    var config = {
      "v": "2",
      "ps": "备注或别名",
      "add": "111.111.111.111",
      "port": "32000",
      "id": "1386f85e-657b-4d6e-9d56-78badb75e1fd",
      "aid": "100",
      "scy": "zero",
      "net": "tcp",
      "type": "none",
      "host": "www.bbb.com",
      "path": "/",
      "tls": "tls",
      "sni": "www.ccc.com",
      "alpn": "h2",
      "fp": "chrome"
    }
    var rawData = Base64.encode('vmess://' + Base64.encode(JSON.stringify(config)))

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('备注或别名')
    expect(res['protocol']).toBe('vmess')
    expect(res['setting']['uuid']).toBe('1386f85e-657b-4d6e-9d56-78badb75e1fd')
    expect(res['setting']['security']).toBe('zero')
    expect(res['setting']['alter_id']).toBe(100)

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['tls']['server_name']).toBe('www.ccc.com')
    expect(transport['tls']['utls']['enabled']).toBe(true)
    expect(transport['tls']['utls']['fingerprint']).toBe('chrome')
    expect(transport['tls']['alpn']).toStrictEqual(['h2'])
    expect(transport['address']).toBe('111.111.111.111')
    expect(transport['port']).toBe(32000)
    expect(transport['protocol']).toBe('tcp')
  });

})
