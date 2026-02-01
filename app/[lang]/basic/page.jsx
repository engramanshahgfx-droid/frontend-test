import BasicComponent from "@/components/basic/basic";

export default async function Basic({ params }) {
  try {
    const { lang } = await params;
    const validLang = ['ar', 'en'].includes(lang) ? lang : 'ar';
    return (
      <>
        <BasicComponent lang={validLang} />
      </>
    );
  } catch (error) {
    console.error('Error in Basic:', error);
    return <BasicComponent lang="ar" />;
  }
}