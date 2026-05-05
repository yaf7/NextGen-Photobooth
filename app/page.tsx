import PhotoBooth from "./components/PhotoBooth";

export default function Home() {
  return (
    <>
      {/* Aurora background */}
      <div className="aurora-bg" aria-hidden="true" />
      <PhotoBooth />
    </>
  );
}
