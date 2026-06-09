# Tus plugins te están pidiendo Behat (y aún no lo sabes)

Hace unas semanas presenté en la [MoodleMoot España](https://moodlemoot.es/mod/callforpaper/view.php?rid=59) una charla con este mismo título. La idea era quitarle el miedo a Behat, la herramienta con la que Moodle™ prueba sus plugins «como lo haría un usuario de verdad». Aquí dejo un resumen de lo que conté, por si te sirve para dar el primer paso.

## ¿Qué es Behat?

Behat es un *framework* de PHP para escribir **pruebas funcionales** siguiendo la filosofía BDD (*Behavior Driven Development*). Es la implementación en PHP de [Cucumber](https://cucumber.io/), y lo bueno es que los tests se escriben en un lenguaje casi natural: cualquiera puede leer un escenario y entender qué se está comprobando, aunque no sepa programar.

## PHPUnit vs Behat

En Moodle conviven dos mundos de testing y conviene no confundirlos:

| | PHPUnit | Behat |
| --- | --- | --- |
| Enfoque | TDD | BDD |
| Tipo | Pruebas unitarias | Pruebas funcionales |
| Granularidad | 1 test → 1 función de código | 1 test → 1 funcionalidad |
| Nivel | Bajo nivel, lo leen los programadores | Alto nivel, legible por cualquiera |

No compiten: se complementan. PHPUnit comprueba que tu lógica funciona; Behat comprueba que la funcionalidad se comporta como espera el usuario final.

## Ya usas BDD sin darte cuenta

Cuando alguien te pide *«quiero que los próximos eventos del calendario se vean desde varias páginas»*, antes de escribir una línea de código tu cabeza ya define el **comportamiento esperado**: qué información hay que mostrar, qué tipo de plugin necesitas y quién puede verla. Eso, en esencia, ya es BDD. Behat solo te da una forma de escribirlo para que la máquina lo verifique por ti.

## La anatomía de un test

Un test de Behat se construye con unas pocas piezas:

- **Feature**: un conjunto de *Scenarios*.
- **Scenario**: una lista de *Steps*.
- **Step**: una frase que describe una acción. Hay varios tipos: `Given` (contexto inicial), `When` (acción), `Then` (resultado) y `And` (para no repetir palabras clave).
- **Gherkin**: el lenguaje de los tests; cada frase llama por debajo a una función PHP.
- **Background**: agrupa los `Given` que se repiten en varios escenarios.
- **Tags**: etiquetas para clasificar los tests (`@javascript`, `@block`, `@local_miplugincito`...).

Y por debajo, **Selenium** automatiza un navegador real para que los pasos interactúen con tu instancia de Moodle.

## Escribiendo tu primer test

Mi receta para empezar son cuatro preguntas:

1. **¿Qué quiero probar?** El funcionamiento general, las funcionalidades clave, los mensajes de éxito y error, y los casos raros.
2. **¿Cómo empiezo?** Creas el fichero `<plugin>/tests/behat/mi_primer_test.feature` y escribes Gherkin.
3. **¿Qué pasos existen ya?** En `admin/tool/behat` (Definiciones de etapas) tienes un buscador con todos los steps disponibles. No reinventes la rueda.
4. **Read the docs!** Lee los tests de plugins parecidos como si fuera tu novela favorita.

Un escenario real, replicado del propio core, queda así de legible:

```gherkin
@block @block_calendar_upcoming @javascript
Feature: Añadir el bloque de Próximos eventos en un curso,
  crear un evento de sitio y comprobar que se muestra en el bloque.

  Background:
    Given the following "users" exist:
      | username  | firstname | lastname  | email                | idnumber |
      | profesor1 | Héctor    | Benedicte | hector@eligeapps.com | p1       |
    And the following "blocks" exist:
      | blockname         | contextlevel | reference | pagetypepattern | defaultregion |
      | calendar_upcoming | System       | 1         | site-index      | side-pre      |

  Scenario: Ver un evento de sitio en el bloque de Próximos eventos
    Given I log in as "admin"
    And I create a calendar event with form data:
      | Type of event | site                      |
      | Event title   | MoodleMoot España 2026    |
      | Description   | El mejor evento del mundo |
    And I log out
    When I log in as "profesor1"
    And I am on site homepage
    Then I should see "MoodleMoot España 2026" in the "Upcoming events" "block"
```

## Montando el entorno de pruebas

Aquí viene el *plot twist*: **los tests de Behat se ejecutan sobre otra instancia de Moodle**, distinta de la de producción. Necesitas cuatro cosas —una instancia de Moodle, un navegador (Firefox o Chrome), Selenium y Java— y seguir estos pasos:

1. Levantar el Selenium Server: `java -jar selenium-server-4.41.0.jar standalone`.
2. Tener el navegador instalado y accesible desde el `$PATH`.
3. Añadir la configuración de Behat a tu `config.php` (`behat_wwwroot`, `behat_prefix`, `behat_dataroot`, `behat_faildump_path`...).
4. Inicializar el entorno: `php admin/tool/behat/cli/init.php`.

Al terminar tendrás unas tablas nuevas en la base de datos, un `moodledata_behat` propio y el entorno de aceptación listo para usar.

## Ejecutar y depurar

Lanzar un test es tan sencillo como:

```bash
vendor/bin/behat --config behat.yml mi_primer_test.feature
```

Un par de trucos que enseñé en la charla:

- **`And I pause`** detiene la ejecución para que veas qué está pasando en el navegador. Ideal para ir despacio.
- **`--format=pretty --out=.../pretty.txt`** vuelca el resultado a un fichero, muy útil para revisar errores con calma.
- Si tocas un `.feature` y empieza a fallar de forma rara, vuelve a ejecutar `init.php`: muchas veces el entorno necesita reinicializarse.
- Y si te gusta el confort, [PHPStorm ejecuta Behat](https://www.jetbrains.com/help/phpstorm/using-behat-framework.html) directamente desde el IDE.

## Ir más allá: entidades y steps propios

Cuando los pasos y los datos de serie se te quedan cortos, Moodle te deja ampliarlos:

- **Entidades propias**: un *data generator* (`behat_<componente>_generator`) te permite crear con un `Given` tus propios objetos o registros en base de datos.
- **Steps propios**: si ninguna frase existente encaja, defines la tuya en una clase `behat_<plugin>.php` que, por debajo, ejecuta el código PHP que tú quieras.

## Buenas prácticas (y accesibilidad)

- Prueba **una sola funcionalidad por Scenario**.
- Evita los selectores CSS y XPath siempre que puedas.
- Mantén el orden en `/tests/behat`: nombres descriptivos y una carpeta `fixtures`.
- Evita pasos innecesarios: llega a tu destino por el camino más corto.
- Y no te olvides de la accesibilidad: con `And the page should meet accessibility standards` puedes comprobar el cumplimiento de **WCAG 2.1 nivel AA**.

## Aliados y recursos

No estás solo en esto. Algunas herramientas que mencioné: `admin/tool/behat`, [MDLCode](https://mdlcode.dev/), [Moodle Plugin CI](https://moodlehq.github.io/moodle-plugin-ci/), [MDK](https://moodledev.io/general/development/tools/mdk) y GitHub Copilot con las *instructions* de Moodle. Para seguir aprendiendo, la [Moodle Academy](https://moodle.academy/course/view.php?id=158) tiene un curso entero de *Acceptance Testing with Behat*, y la documentación oficial de [Moodle](https://moodledev.io/general/development/tools/behat), [Gherkin](https://cucumber.io/docs/gherkin/reference) y [Behat](https://docs.behat.org/en/latest/) es excelente.

## Cierre

Sí, Behat tiene una curva de aprendizaje inicial. Pero a medio plazo esas horas se recompensan con creces: detecta regresiones automáticamente y te ahorra muchos sustos inesperados. Tus plugins te lo están pidiendo. 😉

¡Gracias, #moodlers!

---
