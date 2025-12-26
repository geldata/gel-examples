import gel
import gel.ai
from constants import DEVICE, IMAGES_DIR, model, preprocess
import torch
from PIL import Image
from typing import List, Sequence


client = gel.create_client(tls_security="insecure")


def load_images(*image_paths: str) -> torch.Tensor:
    images = [preprocess(Image.open(path).convert("RGB")) for path in image_paths]
    return torch.stack(images).to(DEVICE)


class EmbeddingModel(gel.ai.BaseEmbeddingModel[str]):

    async def generate(self, text: str) -> Sequence[float]:
        image_input = load_images(text)

        with torch.no_grad():
            embeddings = model.encode_image(image_input).float()
        return embeddings.cpu().numpy().tolist()[0]

    def dimensions(self) -> int:
        return 512

    def target_type(self) -> List[str]:
        return List[str]


vector_store = gel.ai.create_vstore(
    client=client,
    record_type="Image",
    collection_name="images",
    embedding_model=EmbeddingModel(),
)
