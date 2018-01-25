describe("Person edit module", function() {
  it("can open", function() {
    PersonEdit.open({
        title: 'Családtag létrehozása',
        button: 'Létrehozás',
        icon: 'add'
      });
  });
});
