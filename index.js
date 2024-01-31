const d = document,
    $date = d.getElementById("date"),
    $table = d.querySelector(".crud-table"),
    $template = d.getElementById("crud-template").content,
    $fragment = d.createDocumentFragment(),
    $form = d.querySelector(".create-form"),
    $formSubmitt = d.querySelector(".button"),
    $search = d.getElementById("type-of-search"),
    $gen = d.getElementById("gen")
    ;

let $typeSearch = "name";

/*------------------ CRUD ------------------*/

function setDate() {
    let date = new Date().toLocaleDateString("en-GB");
    arrayDate = date.split("/").reverse();
    date = arrayDate.join("-");
    $date.value = date;
}

function ajax(options) {
    let {
        url,
        method,
        success,
        error,
        data
    } = options

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);
            success(json);
        } else {
            let message = xhr.statusText || "Ocurrió un error";
            error(`Error ${xhr.status}: ${message}`);
        }
    })

    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
}

function addTemplate(selector) {
    $templateQuery = $template.querySelector(selector);
    return $templateQuery;
}

//Get the registers in the table
function getAll() {
    ajax({
        url: "http://localhost:3000/pacientes",
        success: (res) => {
            res.forEach(el => {
                addTemplate(".name").textContent = el.name;
                addTemplate(".name").parentElement.dataset.id = el.id;
                addTemplate(".dir").textContent = el.direction;
                addTemplate(".tel").textContent = el.telphone;
                addTemplate(".age").textContent = el.age;
                addTemplate(".date").textContent = el.date;
                addTemplate(".gen").textContent = el.genre;
                addTemplate(".diag").textContent = el.diagnosis;
                addTemplate(".obs").textContent = el.comments;
                addTemplate(".update").dataset.id = el.id;
                addTemplate(".delete").dataset.id = el.id;
                addTemplate(".delete").dataset.name = el.name;
                addTemplate(".delete").dataset.date = el.date;
                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            })
            $table.querySelector("tbody").appendChild($fragment);
        },
        error: (err) => {
            $table.insertAdjacentHTML("afterend", `
            <p><b><mark>${err}</mark></b></p>`)
            console.warn(err)
        }
    })
}

d.addEventListener("DOMContentLoaded", e => {
    setDate();
    getAll();
    //Default value is name
    searchFilters(".search", `.${$typeSearch}`);
})

//CREATE a new register
d.addEventListener("submit", e => {
    e.preventDefault();
    if (e.target === $form) {
        let
        $inputName = d.querySelector("input[name = 'name']").value,
        $inputDir = d.querySelector("input[name = 'dir']").value,
        $inputTel = parseInt(d.querySelector("input[name = 'tel']").value),
        $inputAge = parseInt(d.querySelector("input[name = 'age']").value),
        $genSelected = $gen.options[$gen.selectedIndex].value,
        $inputDiag = d.querySelector("input[name = 'diag']").value,
        $textObs = d.getElementById("obs").value;
        console.log(typeof $inputTel);
        console.log($textObs);
        if (allValidations($inputName, $inputDir, $inputTel, $inputAge, $genSelected, $inputDiag, $textObs))
            ajax({
                url: "http://localhost:3000/pacientes",
                method: "POST",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend", `
                <p><b><mark>${err}</mark></b></p>`),
                data: {
                    name: e.target.name.value,
                    direction: e.target.dir.value,
                    telphone: e.target.tel.value,
                    age: e.target.age.value,
                    genre: e.target.gen.value,
                    diagnosis: e.target.diag.value,
                    comments: e.target.obs.value,
                    date: e.target.date.value
                }
            })
    }
})

//DELETE a register and identify the register column of the table for the an update
d.addEventListener("click", e => {
    if (e.target.tagName === "TR" || e.target.tagName === "TD") {
        if (!e.target.parentElement.matches(".head-table")) {
            if (!e.target.matches(".date")) {
                e.target.setAttribute("contenteditable", true);
                e.target.classList.add("editable");
            } else alert("La fecha NO puede ser MODIFICADA. Genere un nuevo registro si existe una nueva consulta.")
        }
    }
    if (e.target.matches(".delete")) {
        let $name = e.target.dataset.name;
        let $date = e.target.dataset.date;
        let $register = e.target.parentElement.parentElement;
        $register.classList.add("delete-register");
        //Se agrega setTimeout para dar tiempo de agregar la clase y la fila pueda cambiar de calor
        setTimeout(() => {
            if (confirm(`¿Está seguro de eliminar el registro de: 
                ${$name} con fecha del ${$date}?`)) {
                ajax({
                    url: `http://localhost:3000/pacientes/${e.target.dataset.id}`,
                    method: "DELETE",
                    success: (res) => {
                        alert("¡Registro eliminado con éxito!");
                        location.reload()
                    },
                    error: (err) => $table.insertAdjacentHTML("afterend", `
                    <p><b><mark>${err}</mark></b></p>`)
                })
            } 
            $register.classList.remove("delete-register");
        }, 50); 
    } 
    if (e.target.matches(".update")) {
        let $register = e.target.parentElement.parentElement;
        $register.classList.toggle("register-editable");
    }
})

//UPDATE one or more column of a register
d.addEventListener("keydown", e => {
    if (e.target.parentElement.matches(".register")) {
        if (e.key === "Enter") {
            e.preventDefault();
            let children = e.target.parentElement.children;
            $id = e.target.parentElement.dataset.id;
            if (e.target.innerHTML !== "") {
                ajax({
                    url: `http://localhost:3000/pacientes/${$id}`,
                    method: "PUT",
                    success: (res) => location.reload(),
                    error: (err) => $table.insertAdjacentHTML("afterend", `
                    <p><b><mark>${err}</mark></b></p>`),
                    data: {
                        name: children[0].innerText,
                        direction: children[1].innerHTML,
                        telphone: children[2].innerHTML,
                        age: children[3].innerHTML,
                        genre: children[4].innerHTML,
                        date: children[5].innerHTML,
                        diagnosis: children[6].innerHTML,
                        comments: children[7].innerHTML
                    }
                });
                e.target.classList.remove("editable");
            } else alert("Este es un campo obligatorio");
        }
    }
})

/*-------------- SEARCH FILTER -------------*/
d.addEventListener("change", e => {
    if (e.target.matches("#type-of-search")) {
        $typeSearch = $search.options[$search.selectedIndex].value;
        searchFilters(".search", `.${$typeSearch}`);
    }
})

function searchFilters(input, selector) {
    d.addEventListener("keyup", e => {
        if (e.target.matches(input)) {
            if (e.key === "Escape") e.target.value = "";
            d.querySelectorAll(selector).forEach(el => {
                el.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ?
                    el.parentElement.classList.remove("filter")
                    : el.parentElement.classList.add("filter");
            })
        }
    })
}

/*------------------ Form Validations ------------------*/
/*---------Global Validations-----------*/
const stringValidation = (prop, value) => {
    if (!value) return console.error(`${prop} "${value}" está vacío.`);
    if (typeof value !== "string") return console.error(`${prop} "${value}" debe ser una cadena de texto.`);
    return true;
}

const longitudeValidation = (prop, value, longMin, longMax) => {
    if (typeof value !== "string") value += "";
    if (value.length > longMax || value.length < longMin)
        return console.error(`${prop} debe tener entre ${longMin} - ${longMax} caracteres.`);
    return true;
}

const numbersValidation = (prop, value) => {
    if (!value) return console.error(`${prop} "${value}" está vacío.`);
    if (typeof value !== "number") return console.error(`${prop} "${value}" debe ser un número`);
    return true;
}

/*----------- Form Validations -------------*/
const formValidation = (prop, value, type, longMin, longMax) => {
    if (type === "string") {
        if (stringValidation(prop, value)) {
            if (longitudeValidation(prop, value, longMin, longMax))
                return true;
        }
    }

    if (type === "number") {
        if (numbersValidation(prop, value)) {
            if (longitudeValidation(prop, value, longMin, longMax))
                return true;
        }
    }
}

/*----------- Form Validations -------------*/
const allValidations = ($inputName, $inputDir, $inputTel, $inputAge, $genSelected, $inputDiag, $textObs) => {
    if (formValidation("Nombre", $inputName, "string", 5, 50))
        if (formValidation("Dirección", $inputDir, "string", 5, 50))
            if (formValidation("Teléfono", $inputTel, "number", 9, 12))
                if (formValidation("Edad", $inputAge, "number", 1, 3))
                    if (formValidation("Género", $genSelected, "string", 1, 2))
                        if (formValidation("Diagnóstico", $inputDiag, "string", 2, 100))
                            if (formValidation("Observaciones", $textObs, "string", 2, 300)) return true;
}






