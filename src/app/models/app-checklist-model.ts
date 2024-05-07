import Cmf from "cmf-lbos";

export class AppChecklistModel {
  getChecklist(): Cmf.Foundation.BusinessObjects.Checklist {
    const checklist = new Cmf.Foundation.BusinessObjects.Checklist();
    checklist.Name = "My Checklist";
    checklist.Description = "This is a checklist";
    checklist.Items = new Cmf.Foundation.BusinessObjects.ChecklistItemCollection();

    const item1 = new Cmf.Foundation.BusinessObjects.ChecklistItem();
    item1.Name = "Item 1";
    item1.Description = "This is item 1";

    const item2 = new Cmf.Foundation.BusinessObjects.ChecklistItem();
    item2.Name = "Item 2";
    item2.Description = "This is item 2";

    checklist.Items.push(item1, item2);

    return checklist;
  }
}