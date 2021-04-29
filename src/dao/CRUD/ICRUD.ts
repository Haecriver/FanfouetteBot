import IDao from "../IDao";

export default interface ICRUD<model> {
    create: (newElement: model) => Promise<model>;
    read: () => Promise<model | model[]>;
    update: (element: model) => Promise<model>;
    delete: (element: model) => Promise<void>;
}