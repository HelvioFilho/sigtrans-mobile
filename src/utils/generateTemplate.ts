import { VehicleInspection } from "@/database/schemas/VehicleInspection";
import { CheckListProps, GalleryProps } from "@/screens/Document";

function generateItemList(items: CheckListProps[]) {
  return items
    .map(
      (item) => `
  <li>
    <strong>${item.name}</strong> |
    <strong>Estado: </strong>${item.damage}
  </li>`
    )
    .join("");
}

function generateGalleryList(images: GalleryProps[]) {
  return images
    .map(
      (image) => `
  <img style="max-width: 500px; max-height: 300px; margin: 5px;" src="${image.uri}" alt="Imagem do veículo" />
  `
    )
    .join("");
}

export function generateTemplate(
  data: VehicleInspection,
  checkList: CheckListProps[],
  gallery: GalleryProps[]
) {
  let itemList = "";
  let galleryList = "";
  if (checkList.length > 0) {
    const listFormatted = generateItemList(checkList);
    itemList = `<h2>Condições do Veículo</h2>
    <ul>
      ${listFormatted}
    </ul>`;
  }
  if (gallery.length > 0) {
    const galleryFormatted = generateGalleryList(gallery);
    galleryList = `<h2>Galeria</h2>
    <div style="text-align: center">
      ${galleryFormatted}
    </div>`;
  }

  const htmlTemplateDoc = `<html>
  <head>
    <meta charset="UTF-8" />
    <title>Documento de notificação de reboque do veículo</title>
  </head>
  <body style="font-family: Arial, sans-serif">
    <div style="width: 80%; margin: auto">
      <h1 style="text-align: center">
        Documento de notificação <br>Reboque do veículo
      </h1>
      <table style="width: 100%; border-collapse: collapse">
        <tr>
          <td style="padding-top: 10px; padding-bottom: 10px">
            <strong>Data:</strong> ${data.dateString}
          </td>
        </tr>
      </table>

      <h2>Informações do Veículo</h2>
      <table
        style="width: 100%; border: 1px solid black; border-collapse: collapse"
      >
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Placa:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">${data.plate}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Chassi:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">${data.chassi}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Marca:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">${data.brand}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Modelo:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">${data.model}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>UF:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">${data.uf}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Tipo:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">${data.type}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Espécie:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.species}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Ano:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">${data.year}</td>
        </tr>
      </table>

      <h2>Informações do Reboque</h2>
      <table
        style="width: 100%; border: 1px solid black; border-collapse: collapse"
      >
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Placa do Guincho:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.plateTowTruck}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Motorista do Guincho:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.driverTowTruck}
          </td>
        </tr>
      </table>

      <h2>Informações do Parque de Retenção</h2>
      <table
        style="width: 100%; border: 1px solid black; border-collapse: collapse"
      >
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Nome do Parque:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.retentionParkName}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Endereço do Parque:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.retentionParkAddress}
          </td>
        </tr>
      </table>

      <h2>Informações do Condutor</h2>
      <table
        style="width: 100%; border: 1px solid black; border-collapse: collapse"
      >
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Nome do Condutor:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.driverName}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Carteira de Identidade ou CNH:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.driverLicenseOrId}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Email do Condutor:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.driverEmail}
          </td>
        </tr>
      </table>

      <h2>Informações do Agente</h2>
      <table
        style="width: 100%; border: 1px solid black; border-collapse: collapse"
      >
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Nome do Agente:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.agentName}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>ID do Agente:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.agentId}
          </td>
        </tr>
      </table>

      <h2>Informações da Localidade</h2>
      <table
        style="width: 100%; border: 1px solid black; border-collapse: collapse"
      >
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Endereço:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.address}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Latitude:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.latitude}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 10px; width: 20%">
            <strong>Longitude:</strong>
          </td>
          <td style="border: 1px solid black; padding: 10px">
            ${data.longitude}
          </td>
        </tr>
      </table>

      ${itemList}

      ${galleryList}
      
      <h2>Observações</h2>
      <p style="border: 1px solid black; padding: 10px">${data.observations}</p>
    </div>
  </body>
</html>`;

  return htmlTemplateDoc;
}
