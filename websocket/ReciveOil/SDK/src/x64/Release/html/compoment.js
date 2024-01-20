class Component {
    constructor() {}
    touchStart() {}
    touchMove() {}
    touchEnd() {}
}

class BinaryComponent extends Component {
    constructor(buttomNumber) {
        super();
        this.buttomNumber = buttomNumber;
    }
}

class ButtomComponent extends BinaryComponent {
    constructor(number){
        super(number);
    }
    touchStart() {
        var controlTarget = event.target.parentElement;
        controlTarget.setAttribute("state", "on");
        control(this.buttomNumber, 1, true);
    }
    touchMove() {
    }
    touchEnd() {
        var controlTarget = event.target.parentElement;
        controlTarget.setAttribute("state", "off");
        control(this.buttomNumber, 0, true);
    }
}

class SwitchComponent extends BinaryComponent {
    constructor(number){
        super(number);
    }
    touchStart(event) {
        var controlTarget = event.target.parentElement;
        if (controlTarget.getAttribute("state") == "on") {
            controlTarget.setAttribute("state", "off");
            control(this.buttomNumber, 0, true);
        } else {
            controlTarget.setAttribute("state", "on");
            control(this.buttomNumber, 1, true);
        }
    }
    touchMove() {}
    touchEnd() {}
}

class TwoSwitchComponent extends BinaryComponent { // open and close component
    constructor(buttomNumber1, buttomNumber2){
        super(-1);
        this.buttomNumber1 = buttomNumber1;
        this.buttomNumber2 = buttomNumber2;
    }
    touchStart(event) {
        var controlTarget = event.target.parentElement;
        if (controlTarget.getAttribute("state") == "on") {
            controlTarget.setAttribute("state", "off");
            control(this.buttomNumber1, 0, true);
            control(this.buttomNumber2, 1, true);
        } else {
            controlTarget.setAttribute("state", "on");
            control(this.buttomNumber1, 1, true);
            control(this.buttomNumber2, 0, true);
        }
    }
    touchMove() {}
    touchEnd() {}
}

class AxisComponent extends Component {
    constructor(axisNumber) {
        super();
        this.axisNumber = axisNumber;
    }
}

class BarComponent extends AxisComponent {
    constructor(axisNumber){
        super(axisNumber);
    }
    touchStart(event) {
        this.getValue(event);
    }
    touchMove(event) {
        this.getValue(event);
    }
    touchEnd(event) {
        this.getValue(event);
    }
    getValue(event) {
        var controlTarget = event.target.parentElement;
        var per = (event.pageY - controlTarget.offsetTop) / controlTarget.offsetHeight;
        if (per < 0) per = 0;
        if (per > 1) per = 1;
        controlTarget.querySelector(".pos").style.height = per * 100 + "%";
        per = (per * ((1 << 15))) | 0;
        control(this.axisNumber, per, false);
    }
}

class ComponentUtil {
    static getComponent(target) {
        if (target.className != "detect") return new Component();
        var controlTarget = target.parentElement;
        if (controlTarget.id == "throttle") {
            return new BarComponent(4);
        }
        if (controlTarget.id == "zoom") {
            return new BarComponent(5);
        }
        if (controlTarget.id == "brake") {
            return new TwoSwitchComponent(0, 1);
        }
        if (controlTarget.id == "landing-gear") {
            return new ButtomComponent(2);
        }
    }
}
