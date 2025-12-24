import { Button } from "../ui/button";

function ItemButton({ brand }: { brand: string }) {
  return (
    // <Card className="flex-col w-[90%] mx-auto rounded-xl h-24 flex items-center justify-center my-2">
    <Button
      onClick={() => {
        window.location.href = `/products/brand/${encodeURIComponent(brand)}`;
      }}
      variant={"outline"}
      className="flex ml-auto mr-2 mb-2 mt-auto w-full"
    >
      {brand}
    </Button>
    // </Card>
  );
}

export default ItemButton;
