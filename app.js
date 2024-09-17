'use strict';

const numberbox = document.getElementById("numberbox");
const slider = document.getElementById("slider");
const progressBar = document.getElementById("progress-bar");
const playButton = document.getElementById('play-button');

const queen = '<i class="fas fa-chess-queen" style="color:#000"></i>';

let n, speed, tempSpeed, q, Board = 0;
const array = [0, 2, 1, 1, 3, 11, 5, 41, 93];
let pos = {};

speed = (100 - slider.value) * 10;
tempSpeed = speed;

slider.oninput = debounce(function () {
    progressBar.style.width = this.value + "%";
    speed = (100 - slider.value) * 10;
}, 100);

class Queen {
    constructor() {
        this.position = { ...pos };
        this.uuid = [];
    }

    async nQueen() {
        Board = 0;
        this.position[`${Board}`] = {};
        numberbox.disabled = true;
        await this.solveQueen(Board, 0, n);
        await this.clearColor(Board);
        numberbox.disabled = false;
    }

    async isValid(board, r, col, n) {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        const currentRow = table.firstChild.childNodes[r];
        const currentColumn = currentRow.getElementsByTagName("td")[col];
        currentColumn.innerHTML = queen;
        await this.delay();

        for (let i = r - 1; i >= 0; --i) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[col];
            if (column.innerHTML == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-";
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await this.delay();
        }

        for (let i = r - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            if (column.innerHTML == queen) {
                column.style.backgroundColor = "#fb5607";
                currentColumn.innerHTML = "-";
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await this.delay();
        }

        for (let i = r - 1, j = col + 1; i >= 0 && j < n; --i, ++j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            if (column.innerHTML == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-";
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await this.delay();
        }
        return true;
    }

    async clearColor(board) {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        for (let j = 0; j < n; ++j) {
            const row = table.firstChild.childNodes[j];
            for (let k = 0; k < n; ++k) {
                row.getElementsByTagName("td")[k].style.backgroundColor = (j + k) & 1 ? "#FF9F1C" : "#FCCD90";
            }
        }
    }

    async delay() {
        await new Promise((done) => setTimeout(done, speed));
    }

    async solveQueen(board, r, n) {
        if (r == n) {
            ++Board;
            const table = document.getElementById(`table-${this.uuid[Board]}`);
            for (let k = 0; k < n; ++k) {
                const row = table.firstChild.childNodes[k];
                row.getElementsByTagName("td")[this.position[board][k]].innerHTML = queen;
            }
            this.position[Board] = { ...this.position[board] };
            return;
        }

        for (let i = 0; i < n; ++i) {
            await this.delay();
            await this.clearColor(board);
            if (await this.isValid(board, r, i, n)) {
                await this.delay();
                await this.clearColor(board);
                const table = document.getElementById(`table-${this.uuid[board]}`);
                const row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = queen;

                this.position[board][r] = i;

                if (await this.solveQueen(board, r + 1, n)) {
                    await this.clearColor(board);
                }

                await this.delay();
                board = Board;
                const newTable = document.getElementById(`table-${this.uuid[board]}`);
                const newRow = newTable.firstChild.childNodes[r];
                newRow.getElementsByTagName("td")[i].innerHTML = "-";

                delete this.position[`${board}`][`${r}`];
            }
        }
    }
}

playButton.onclick = async function visualise() {
    const chessBoard = document.getElementById("n-queen-board");
    const arrangement = document.getElementById("queen-arrangement");

    n = numberbox.value;
    q = new Queen();

    if (n > 8 || n < 1) {
        numberbox.value = "";
        alert("Queen value is out of range");
        return;
    }

    while (chessBoard.firstChild) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
    while (arrangement.firstChild) {
        arrangement.removeChild(arrangement.firstChild);
    }

    const para = document.createElement("p");
    para.setAttribute("class", "queen-info");
    para.innerHTML = `For ${n}x${n} board, ${array[n] - 1} arrangements are possible.`;
    arrangement.appendChild(para);

    for (let i = 0; i < array[n]; ++i) {
        q.uuid.push(Math.random());
        const div = document.createElement('div');
        const table = document.createElement('table');
        const header = document.createElement('h4');
        header.innerHTML = `Board ${i + 1}`;
        table.setAttribute("id", `table-${q.uuid[i]}`);
        header.setAttribute("id", `paragraph-${i}`);
        chessBoard.appendChild(div);
        div.appendChild(header);
        div.appendChild(table);
    }

    for (let k = 0; k < array[n]; ++k) {
        const table = document.getElementById(`table-${q.uuid[k]}`);
        for (let i = 0; i < n; ++i) {
            const row = table.insertRow(i);
            for (let j = 0; j < n; ++j) {
                const col = row.insertCell(j);
                col.style.backgroundColor = (i + j) & 1 ? "#FF9F1C" : "#FCCD90";
                col.innerHTML = "-";
                col.style.border = "0.3px solid #373f51";
            }
        }
        await q.clearColor(k);
    }
    await q.nQueen();
};

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}