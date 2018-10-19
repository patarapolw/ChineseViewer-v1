from chineseviewer import app


def main():
    app.run(
        port=42045,
        debug=True
    )


if __name__ == '__main__':
    main()
