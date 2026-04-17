import type { MetadataRoute } from "next";

export default function manifest():
MetadataRoute.Manifest{
 return {
  name: "Offline Dictionary",
  short_name:"Dictionary",
  description:"an offline first dictionary",
  start_url:"/",
  display:"standalone",
  background_color:"#000000",
  theme_color:"#2563eb",
  icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
 }
}