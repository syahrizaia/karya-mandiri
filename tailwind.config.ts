const config = {
  theme: {
    extend: {
      keyframes: {
        typing: {
          "from": { width: "0" },
          "to": { width: "100%" }
        },
        blink: {
          "50%": { borderColor: "transparent" }
        }
      },
      animation: {
        typing: "typing 3.5s steps(40, end), blink .75s step-end infinite"
      }
    }
  }
}