CONTAINERTAG := node:tiny-tinacms-test


build:
	podman build --tag ${CONTAINERTAG} -f buildpod

run:
	podman run -it -p 3000:3000 \
		-v ./src/:/opt/src:z \
		-v ./data/:/opt/data:z \
		-v ./rsc/:/opt/rsc:z \
		${CONTAINERTAG}