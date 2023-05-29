import { VehicleInspection } from "@/database/schemas/VehicleInspection";
import { DocumentsListProps } from "@/screens/Home";

export function sortedDate(
  data: Realm.Results<VehicleInspection & Realm.Object>
) {
  return data.sorted("date", true).reduce((acc, curr) => {
    const date = curr.date.toLocaleDateString("pt-BR");
    const find = acc.find((item) => item.date === date);
    if (!find) {
      acc.push({
        date,
        data: [
          {
            id: curr.documentId,
            name: curr.agentName,
            model: curr.model,
            plate: curr.plate,
            retentionPark: curr.retentionParkName,
          },
        ],
      });
    } else {
      find.data.push({
        id: curr.documentId,
        name: curr.agentName,
        model: curr.model,
        plate: curr.plate,
        retentionPark: curr.retentionParkName,
      });
    }
    return acc;
  }, [] as DocumentsListProps[]);
}
