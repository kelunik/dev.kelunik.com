describe("Input", function () {
    var $ = require("jquery");

    var InputView = require("../views/InputView");
    var Input = require("../models/Input");

    it("should be empty after escape", function () {
        var inputView = new InputView({model: new Input});
        inputView.render();

        inputView.input.value = "foo";

        $(inputView.input).trigger($.Event("keydown", {
            which: 27
        }));

        inputView.input.value.should.equal("");
    });

    it("should not be in edit mode after escape", function () {
        var inputView = new InputView({
            model: new Input({
                isEdit: true
            })
        });
        inputView.render();

        inputView.el.classList.contains("message-input-edit").should.true();

        $(inputView.input).trigger($.Event("keydown", {
            which: 27
        }));

        inputView.el.classList.contains("message-input-edit").should.false();
    });
});