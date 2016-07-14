# Loftshool **PHOTOGRAMM**

### Projects Links
* [Task list](https://docs.google.com/spreadsheets/d/1fGqRRAGeujqcND2gL5ljCe2yVsB1Guc97A_XADirQ3I/edit#gid=0)
* [Dev site]()
* [Prod site]()

### Getting started:

```
$ mkdir idz2-photogramm
$ cd ./idz2-photogramm
$ git clone https://github.com/EvgeniyTaburyanskiy/loftschool-idz2.git .

$ npm install
$ gulp
```

###  Branch Naming Agreement
* _master_ - Для стабильных релизов которые можно публиковать на боевой сайт
* _dev_ - В эту ветку сливаем законченые таски
* _task/num_ - Ветка задач где: _num_ - Номер таска соответствует номеру из таск листа [Task list](https://docs.google.com/spreadsheets/d/1fGqRRAGeujqcND2gL5ljCe2yVsB1Guc97A_XADirQ3I/edit#gid=0)
    - делаем это так:<br>
        ```
        $ git checkout  dev //-> Переходим в ветку Dev<br>
        $ git checkout -b task/0  //-> Клонируем Dev в новую ветку и тутже переходим в эту ветку<br>
        ```
    - в процессе делаем коммиты в новой ветке. Делаем Push таска.<br>
        ```
        $ git status  //-> Проверяем что мы в нужной ветке и что есть файлы которые еще не в отслеживании<br>
        $ git add . //-> Добавляем все файлы в отслеживание изменений<br>
        $ git commit -m 'Текст коммита' //-> Сохраняем локально все изменения с коментарием.<br>
        $ git status   //-> Проверяем статус удостоверяемся что все что нужно закоммитилось<br>
        $ git push -u origin  task/0  //-> Пушим локальную копию ветки в глобальный репозиторий <br>
        ```
    - закончив работу по таску сливаем с веткой Dev<br>
        ```        
        $ git checkout  dev //-> Переходим в ветку Dev<br>
        $ git merge task/0  //-> Сливаем ветку task/0 с текущей активной веткой dev<br>
        ```
        
        
### Team Members 
* <img src="https://github.com/favicon.ico" width="64">[Максим Орлов](http://github.com)
* <img src="https://avatars1.githubusercontent.com/u/19729612?v=3&s=460" width="64">[Дмитрий Гавриш](https://github.com/dmitrygavrish)
* <img src="https://avatars1.githubusercontent.com/u/7986099?v=3&s=460" width="64">[Дима Ганин](https://github.com/ganya555)
* <img src="https://avatars1.githubusercontent.com/u/7585251?v=3&s=460" width="64">[Евгений Табурянский](https://github.com/EvgeniyTaburyanskiy)
* <img src="https://avatars2.githubusercontent.com/u/16744815?v=3&s=460" width="64">[Олег Богданов](https://github.com/obogdanov)
