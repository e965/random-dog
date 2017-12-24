'use strict'

var
	dog =           document.querySelector('.dog'),
	textBox =       document.querySelector('.text'),
	resultBox =     document.querySelector('.result'),
	actionButton =  document.querySelector('.actionBtn')

var sounds = {
	roll:     new Audio('assets/sound/roll.opus'),
	neutral:  new Audio('assets/sound/neutral.opus'),
	good:     new Audio('assets/sound/good.opus'),
	bad:      new Audio('assets/sound/bad.opus')
}

var random = async(min, max) => {
	let response = await fetch(`https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`).catch(e => e)
	return response.ok
		? response.text()
		: Math.floor(Math.random() * (max - min + 1)) + min
}

var textDog = text => textBox.textContent = text

var changeSoundVolume = volume => Object.keys(sounds).forEach(sound => sounds[sound].volume = volume)

var drawDog = () => {
	let rectangles = [
		{ y: 0, x: 9 }, { y: 0, x: 11 },
		{ y: 1, x: 9, toX: 11 },
		{ y: 2, x: 1, toX: 12 },
		{ y: 3, x: 0 }, { y: 3, x: 2, toX: 10 },
		{ y: 4, x: 0 }, { y: 4, x: 2, toX: 9 },
		{ y: 5, x: 2, toY: 6 }, { y: 5, x: 3, toY: 6, fill: 'opacity' },
		{ y: 5, x: 8, toY: 6 }, { y: 5, x: 9, toY: 6, fill: 'opacity' }
	], SVGnameSpace = dog.getAttribute('xmlns')

	for (let rect of rectangles) {
		let pixel = document.createElementNS(SVGnameSpace, 'rect')

		if (rect.fill == 'opacity') { pixel.classList.add('opaque') }

		pixel.setAttribute('width', rect.toX ? `${rect.toX - (rect.x - 1)}px` : '1px')
		pixel.setAttribute('height', rect.toY ? `${rect.toY - (rect.y - 1)}px` : '1px')

		pixel.setAttribute('x', `${rect.x}px`)
		pixel.setAttribute('y', `${rect.y}px`)

		dog.appendChild(pixel)
	}
}

var findDog = () => {
	textDog('Идёт поиск собаки...')
	resultBox.textContent = ''
	delete actionButton.dataset.state

	dog.setAttribute('fill', `#${((1 << 24) * Math.random() | 0).toString(16)}`)

	textDog('Уличная собака готова к рандомизации!')
	actionButton.dataset.state = 'ready'
}

var rollDog = () => {
	let some = prompt('Что нужно оценить?', '')

	if (!some) { textBox.textContent = 'Попробуй ещё!'; return }

	dog.dataset.state = 'roll'
	textDog('Уличная собака рандомизирует...')

	delete actionButton.dataset.state

	sounds.roll.play()
	sounds.roll.onended = function() {
		random(1, 10).then(result => {
			result = Number(result)

			setTimeout(function() {
				switch (result) {
					case 1:
						textDog(`Уличная собака блеванула, как только увидела ${some}! Просто омерзительно!`); break
					case 2:
						textDog(`Уличная собака подошла и обоссала ${some}! Полная херня, что уж тут говорить.`); break
					case 3:
						textDog(`${some} не нравится уличной собаке! Она покусала ${some} и убежала!`); break
					case 4:
						textDog(`Уличная собака посмотрела на ${some} и посрала. Ничего интересного.`); break
					case 5:
						textDog(`Уличная собака абсолютно игнорирует присутствие ${some}. Абсолютно похер.`); break
					case 6:
						textDog(`Уличная собака посмотрела на ${some} и уснула. Не интересно, но и доверяет свой сон.`); break
					case 7:
						textDog(`Уличная собака попыталась трахнуть ${some}! Видимо понравилось, но явно без уважения.`); break
					case 8:
						textDog(`Как только появляется ${some}, собака начинает радостно скулить! Кажется ей понравилось!`); break
					case 9:
						textDog(`Уличная собака бросилась облизывать ${some}, как только увидела! Превосходно!`); break
					case 10:
						textDog(`Уличная собака присягнула в верности ${some}! Это просто что-то невероятное!`); break
					default:
						textDog('Собака не захотела оценивать и убежала! Попробуй ещё раз.')
				}

				delete dog.dataset.state

				if (result <= 3) {
					sounds.bad.play()
					resultBox.style.color = 'red'
				} else if (result > 3 && result <= 7) {
					sounds.neutral.play()
					resultBox.style.color = 'yellow'
				} else if (result > 7) {
					sounds.good.play()
					resultBox.style.color = 'lime'
				}

				resultBox.textContent = `${result}/10`
				actionButton.dataset.state = 'back'
			}, 1000)
		})
	}
}

window.addEventListener('DOMContentLoaded', e => {
	drawDog()
	findDog()

	if (isMobile && !isMobile.any) { changeSoundVolume(.4) }

	Array.from(document.querySelectorAll('a[href^="http"]')).forEach(link => {
		link.setAttribute('target', '_blank')
		link.setAttribute('rel', 'nofollow noreffer')
	})

	actionButton.onclick = e => {
		switch (e.target.dataset.state) {
			case 'ready':
				rollDog(); break
			case 'back':
				findDog(); break
		}
	}
})
