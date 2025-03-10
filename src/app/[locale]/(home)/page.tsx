import Container from '@/app/[locale]/_components/container';
import { AppTitle } from "@/app/[locale]/_components/app-title";
import HomePageMap from "@/app/[locale]/_components/home-page-map";

import { fetchSpeciesData, getSinglePage } from "@/lib/api-calls";

import { HomePageData, ImageData } from '@/types/single-types';
import { HomePageSlider } from '../_components/home-page-slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function HomePage({ params }: { params: { locale: string } }) {

  const { locale } = await params

  const response = await fetchSpeciesData(locale, 30)

  const fetchHomePageData = async (locale: string): Promise<HomePageData> => {
    return await getSinglePage<HomePageData>("home-page", locale, "fields[0]=title&fields[1]=subtitle&fields[2]=version&populate[images][fields][0]=documentId&populate[images][fields][1]=name&populate[images][fields][2]=alternativeText&populate[images][fields][3]=caption&populate[images][fields][4]=width&populate[images][fields][5]=height&populate[images][fields][6]=url");
  };

  const data = await fetchHomePageData(locale)

  const coordinates: string[] = response?.data?.length
    ? response.data.map((item: any) => (item.coordinates))
    : []

  const latLngArray: [number, number][] = coordinates
    .filter(coord => coord)
    .map(coord => {
      const [lat, lng] = coord.split(",").map(Number);
      return [lat, lng] as [number, number];
    });

  if (!data) return null

  return (
    <Container>
      <div className='relative mb-8'>
        <div className='absolute z-50 top-4 left-4 right-4 md:right-auto'>
          <AppTitle
            title={data?.title}
            subtitle={data?.subtitle}
            version={data?.version}
          />
        </div>
        <HomePageSlider images={data?.images} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className='h-[300px] bg-slate-100 rounded-none col-span-1'>
            <CardHeader>
              <CardTitle>Text</CardTitle>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        ))}
      </div>


      <HomePageMap data={latLngArray as [number, number][]} />
      <h1>latest reports</h1>
      <h1>user contributions</h1>
    </Container>
  );
}
